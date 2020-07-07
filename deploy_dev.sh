#!/bin/sh
eval $(aws ecr get-login --no-include-email --region ap-south-1 --profile litcomdev)
docker build -t litcom-service-rest:latest -f docker/Dockerfile .
docker tag litcom-service-rest:latest 791195057071.dkr.ecr.ap-south-1.amazonaws.com/litcom-service-rest:latest
docker push 791195057071.dkr.ecr.ap-south-1.amazonaws.com/litcom-service-rest:latest
aws ecs update-service --cluster litcom-service-rest --service litcom-service-rest --force-new-deployment --profile=litcomdev