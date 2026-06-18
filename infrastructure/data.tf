# --- SQS Chaos Queue ---
resource "aws_sqs_queue" "chaos_queue" {
  name                      = "gol-chaos-work-queue"
  message_retention_seconds = 86400 # 1 day retention is plenty for testing
  visibility_timeout_seconds = 30
}

# --- Redis Subnet Group ---
resource "aws_elasticache_subnet_group" "redis_subnets" {
  name       = "gol-redis-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

# --- ElastiCache Redis Engine ---
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "gol-shared-state"
  engine               = "redis"
  node_type            = "cache.t4g.micro" # Cost-effective burstable instance
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnets.name
  security_group_ids   = [aws_security_group.redis_sg.id]
}