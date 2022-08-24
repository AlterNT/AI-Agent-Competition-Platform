from random import random 

class ClientIO:
    def __init__(self, data):
        self.data = data

    def reader(self):
        self.data = str(input())
        print("Data: " + self.data)
