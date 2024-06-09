from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import model_from_json
from PIL import Image
import numpy as np
import io
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)


# Load the model architecture
with open('/workspaces/ClientDenseNet/Manar/densenetmd/config.json', 'r') as json_file:
    model_json = json_file.read()
model = model_from_json(model_json)

# Load the model weights
model.load_weights('/workspaces/ClientDenseNet/Manar/densenetmd/model.weights.h5')

# Optionally, compile the model (necessary if you want to train or evaluate it)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Define endpoint to receive image file and return prediction
@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Resize the image to match model's input shape (assuming 224x224 pixels)
    image = image.resize((224, 224))

    # Convert the image to RGB if it's grayscale
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Convert the image to a numpy array
    image_array = np.array(image)

    # Expand dimensions to match the expected input shape of the model
    image_array = np.expand_dims(image_array, axis=0)

    # Use your model to predict
    prediction = model.predict(image_array)

    # You can process the prediction further if needed
    # For example, converting it to a human-readable format

    return {"prediction": prediction.tolist()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

