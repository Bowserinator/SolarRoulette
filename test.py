import pickle
import base64
import json

def publishData():
   testDict = {}
   testDict['testKey1'] = [1,2,3]
   testDict['testKey2'] = [4,5,6]
   #Dump the dict to pickle file
   with open("test.pkl","wb") as f:
      pickle.dump(testDict, f)
   #Read the pickle
   with open("test.pkl", "rb") as openfile:
      data = openfile.read() #Read the raw pickle (binary)
   print("publishData - Pickle read : {}".format(data))
   #Base64 encode it to ensure formatting in JSON
   data = base64.b64encode(data)
   print("publishData - Base64 encoded : {}".format(data))

publishData()