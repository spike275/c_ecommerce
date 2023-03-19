import re
from django.shortcuts import render
from django.shortcuts import get_object_or_404

from .models import Treatment, Customer, Bday_benefit, Appointment, Product, Image
from .serializers import TreatmentSerializer, CustomerSerializer, AppointmentSerializer, ProductSerializer, ImageSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth import logout
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os



# ////////////////////////////////login /register
# login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        if user.is_authenticated:
            token['username'] = user.username
            token['email'] = user.email
            token['is_admin'] = user.is_superuser
        else:
            raise AuthenticationFailed("User is not authenticated.")
        return token
    

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# register


@api_view(['POST'])
def register(req):
    username = req.data.get("username")
    email = req.data.get("email")
    password = req.data.get("password")
    confirm_password = req.data.get("confirmPassword")

    if not username or not email or not password or not confirm_password:
        return Response("Username, email, password, and confirm password are required.", status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response("Password and confirm password do not match.", status=status.HTTP_400_BAD_REQUEST)

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return Response("Invalid email address.", status=status.HTTP_400_BAD_REQUEST)

    # create a new user (encrypt password)
    try:
        User.objects.create_user(username=username, email=email, password=password)
    except:
        return Response("Error creating user.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(f"{username} registered")



# logout


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def do_logout(request):
    logout(request)
    return Response({"detail": "logout"}, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def fileUploadView(request):
    try:
        file_obj = request.FILES["photo"]
        file_model = Image(title="myImage")
        file_model.save()

        directory = 'media/Posted_Images/'
        if not os.path.exists(directory):
            os.makedirs(directory)

        file_name = str(file_model.id) + '_' + file_obj.name
        file_path = default_storage.save(directory + file_name, ContentFile(file_obj.read()))
        file_model.image = file_path
        file_model.save()
        
        return Response({"success": True, "file_path": file_path})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_images(request):
    """
    List of all product images.
    """
    res = []
    for img in Image.objects.all():  # run on every row in the table...
        res.append({
            "_id": img.id,
            "title": img.title,
            "image":str(img.image)
                    })  # append row by to row to res list
    return Response(res)  # return array as json response



@permission_classes([IsAuthenticated])
class New_Customer(APIView):
    parser_class = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]

    def get(self, request):
        customers = request.user.customer_set.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CustomerSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        customers = Customer.objects.get(pk=pk)
        serializer = CustomerSerializer(customers, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        customers = Customer.objects.get(pk=pk)
        customers.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes([IsAuthenticated])
class TreatmentView(APIView):
    def get(self, request):
        my_model = Treatment.objects.all()
        serializer = TreatmentSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TreatmentSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        treatments = Treatment.objects.get(pk=pk)
        serializer = TreatmentSerializer(treatments, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        treatments = Treatment.objects.get(pk=pk)
        treatments.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes([IsAuthenticated])
class AppointmentView(APIView):
    def get(self, request):
        my_model = Appointment.objects.all()
        serializer = AppointmentSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        appointments = Appointment.objects.get(pk=pk)
        serializer = AppointmentSerializer(appointments, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        appointments = Appointment.objects.get(pk=pk)
        appointments.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# @permission_classes([IsAuthenticated])
# class ProductView(APIView):

#     def get(self, request):

#         my_model = Product.objects.all()
#         serializer = ProductSerializer(my_model, many=True)
#         return Response(serializer.data)

#     def post(self, request):

#         serializer = ProductSerializer(
#             data=request.data, context={'user': request.user})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):

#         my_model = Product.objects.get(pk=pk)
#         serializer = ProductSerializer(my_model, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):

#         my_model = Product.objects.get(pk=pk)
#         my_model.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

@permission_classes([IsAuthenticated])
class New_Product(APIView):
    parser_class = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        products = Product.objects.get(pk=pk)
        serializer = ProductSerializer(products, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        products = Product.objects.get(pk=pk)
        products.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)