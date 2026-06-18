terraform {
  required_version = ">= 1.0.0"

  backend "s3" {
    bucket = "gol-chaos-tf-state-12345" 
    key    = "state/terraform.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Update to your target region if different
}