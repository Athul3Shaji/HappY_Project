from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user, is_deleted=False)
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')

        if status_param:
            # Get valid status choices from the model
            valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
            if status_param not in valid_statuses:
                raise APIException(
                    detail=f'Invalid status. Must be one of: {", ".join(valid_statuses)}',
                    code=status.HTTP_400_BAD_REQUEST
                )
            queryset = queryset.filter(status=status_param)
            
            # Check if any tasks exist with the given status
            if not queryset.exists():
                raise APIException(
                    detail=f'No tasks found with status: {status_param}',
                    code=status.HTTP_404_NOT_FOUND
                )
                
        if priority_param:
            valid_priorities = [choice[0] for choice in Task.PRIORITY_CHOICES]
            if priority_param not in valid_priorities:
                raise APIException(
                    detail=f'Invalid priority. Must be one of: {", ".join(valid_priorities)}',
                    code=status.HTTP_400_BAD_REQUEST
                )
            queryset = queryset.filter(priority=priority_param)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, is_deleted=False)

    def delete(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_deleted = True
        task.save()
        return Response({'message': 'Task soft-deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
