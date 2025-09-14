#!/bin/bash

# EKS Cluster Setup Script
set -e

echo "🚀 Starting EKS Cluster Setup..."

# Variables - Update these with your values
AWS_REGION="us-west-2"
CLUSTER_NAME="medical-app-cluster"
NODE_GROUP_NAME="standard-workers"
NODE_TYPE="t3.medium"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Check if required tools are installed
command -v eksctl >/dev/null 2>&1 || { echo "❌ eksctl is required but not installed. Install from: https://eksctl.io/installation/"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed."; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "❌ Helm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Create EKS Cluster
echo "🏗️ Creating EKS Cluster..."
eksctl create cluster \
  --name $CLUSTER_NAME \
  --region $AWS_REGION \
  --nodegroup-name $NODE_GROUP_NAME \
  --node-type $NODE_TYPE \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4 \
  --managed

# Update kubeconfig
echo "⚙️ Updating kubeconfig..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Create ECR Repository
echo "📦 Creating ECR Repository..."
aws ecr create-repository --repository-name medical-app --region $AWS_REGION || echo "Repository might already exist"

# Install AWS Load Balancer Controller
echo "🔧 Installing AWS Load Balancer Controller..."

# Download IAM policy
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.4/docs/install/iam_policy.json

# Create IAM policy
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json || echo "Policy might already exist"

# Create service account
eksctl create iamserviceaccount \
  --cluster=$CLUSTER_NAME \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name "AmazonEKSLoadBalancerControllerRole" \
  --attach-policy-arn=arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

# Install controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Install metrics server
echo "📊 Installing metrics server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Clean up
rm -f iam_policy.json

echo "🎉 EKS Cluster setup complete!"
echo "📋 Next steps:"
echo "   1. Update ECR_REPO in deploy.sh with: $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/medical-app"
echo "   2. Update your Supabase production credentials in k8s/configmap.yaml"
echo "   3. Update your domain in k8s/ingress.yaml"
echo "   4. Run ./deploy.sh to deploy your application"