locals {
  ecs_execution_role_arn = "arn:aws:iam::710590321638:role/gol-ecs-execution-role"
  ecs_task_role_arn      = "arn:aws:iam::710590321638:role/gol-ecs-task-role"
}

# 2. ECS Cluster Core
resource "aws_ecs_cluster" "cluster" {
  name = "gol-chaos-cluster"
}

# 3. Application Load Balancer (ALB)
resource "aws_lb" "alb" {
  name               = "gol-backend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

# ALB Target Group configured for WebSockets (Sticky sessions or long-lived TCP)
resource "aws_lb_target_group" "tg" {
  name        = "gol-backend-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    port                = "8080"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

# ALB Listener routing port 80 to our containers
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}

# 4. CloudWatch Log Group for Container Output
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/gol-backend"
  retention_in_days = 7
}

# 5. ECS Task Definition (Fargate Compute Blueprint)
resource "aws_ecs_task_definition" "app" {
  family                   = "gol-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256" # 0.25 vCPU (Perfect to show easy starvation)
  memory                   = "512" # 512 MB
  execution_role_arn       = local.ecs_execution_role_arn
  task_role_arn            = local.ecs_task_role_arn

  container_definitions = jsonencode([
    {
      name      = "gol-backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest" # Assumes an ECR resource is declared or built
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        { name = "REDIS_URL", value = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379" },
        { name = "SQS_QUEUE_URL", value = aws_sqs_queue.chaos_queue.url },
        { name = "AWS_REGION", value = "us-east-1" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])
}

# 6. ECR Repository to host your Docker images
resource "aws_ecr_repository" "backend" {
  name                 = "gol-chaos-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = false
  }
}

# 7. ECS Fargate Service
resource "aws_ecs_service" "service" {
  name            = "gol-backend-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1 # Starts with 1 Leader node
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.tg.arn
    container_name   = "gol-backend"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.http]
}

# 8. Application Auto Scaling Configuration
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 5
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Target Tracking Policy matching SQS Queue Load or High CPU
resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  name               = "gol-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 70.0 # Scales up when average cluster CPU passes 70%
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_in_cooldown  = 60
    scale_out_cooldown = 30
  }
}