#!/bin/bash

# Create a directory for whisper.cpp
mkdir -p whisper-cpp
cd whisper-cpp

# Clone the whisper.cpp repository
git clone https://github.com/ggerganov/whisper.cpp.git .

# Download the base model
./models/download-ggml-model.sh base

# Build whisper.cpp
make

# Move the whisper executable to the project root
cp main ../whisper
cd ..

# Clean up
rm -rf whisper-cpp

echo "Whisper.cpp has been installed successfully!" 