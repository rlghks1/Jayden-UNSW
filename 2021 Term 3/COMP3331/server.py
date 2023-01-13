"""
    Sample code for Multi-Threaded Server
    Python 3
    Usage: python3 server.py localhost 12000
    coding: utf-8
    
    Author: Kihwan Baek / z5302513
"""
from socket import *
from threading import Thread
import sys, select

# acquire server host and port from command line parameter
if len(sys.argv) != 4:
    print("\n===== Error usage, python3 server.py SERVER_PORT ======\n");
    exit(0);
serverHost = "127.0.0.1"
serverPort = int(sys.argv[1])
block_duration = int(sys.argv[2])
timeout = int(sys.argv[3])

serverAddress = (serverHost, serverPort)

# define socket for the server side and bind address
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(serverAddress)
serverSocket.settimeout(timeout)

"""
    Define multi-thread class for client
    This class would be used to define the instance for each connection from each client
    For example, client-1 makes a connection request to the server, the server will call
    class (ClientThread) to define a thread for client-1, and when client-2 make a connection
    request to the server, the server will call class (ClientThread) again and create a thread
    for client-2. Each client will be runing in a separate therad, which is the multi-threading
"""
class ClientThread(Thread):
    def __init__(self, clientAddress, clientSocket):
        Thread.__init__(self)
        self.clientAddress = clientAddress
        self.clientSocket = clientSocket
        self.clientAlive = False
        
        # check if client name is in credentials.txt
        # if the client name is matched with a name in the text file,
        # the server approve connection to the client.
        # if not, server assume the client is creating a new account
                
        print("===== New connection created for: ", clientAddress)
        self.clientAlive = True
        
    def run(self):
        message = ''
        
        while self.clientAlive:
            # use recv() to receive message from the client
            data = self.clientSocket.recv(1024)
            message = data.decode()
            
            # if the message from client is empty, the client would be off-line then set the client as offline (alive=Flase)
            if message == '':
                self.clientAlive = False
                print("===== the user disconnected - ", clientAddress)
                break
            
            # handle message from the client
            if message == 'login':
                print("[recv] New login request")
                self.process_login()
            elif message == 'broadcast':
                print("[recv] Broadcast request")
                message = 'Broadcast'
                print("[send] " + message)
                self.clientSocket.send(message.encode())
            elif message == 'whoelse':
            	print("[recv] Whoelse request")
                message = 'Whoelse'
                print("[send] " + message)
                self.clientSocket.send(message.encode())
            elif message == 'whoelsesince':
            	print("[recv] Whoelsesince request")
                message = 'Whoelsesince'
                print("[send] " + message)
                self.clientSocket.send(message.encode())  
            elif message == 'block':
            	print("[recv] block")
                message = 'block'
                print("[send] " + message)
                self.clientSocket.send(message.encode())  
            elif message == 'unblock':
            	print("[recv] Unblock request")
                message = 'Unblock'
                print("[send] " + message)
                self.clientSocket.send(message.encode())  
            elif message == 'logout':
            	print("[recv] Logout request")
                message = 'Logout'
                print("[send] " + message)
                self.clientSocket.send(message.encode())    
            else:
                print("[recv] " + message)
                print("[send] Cannot understand this message")
                message = 'Cannot understand this message'
                self.clientSocket.send(message.encode())
    
    """
        Logic for processing user authentication
        Each api can be used to handle one specific function, for example:
        def process_login(self):
            message = 'user credentials request'
            self.clientSocket.send(message.encode())
    """

    def process_login(self):
        message = 'user credentials request'
        print('[send] ' + message);
        self.clientSocket.send(message.encode())

print("\n===== Server is running =====")
print("===== Waiting for connection request from clients...=====")


while True:
    serverSocket.listen()
    clientSockt, clientAddress = serverSocket.accept()
    clientThread = ClientThread(clientAddress, clientSockt)
    clientThread.start()