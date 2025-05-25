import json
import os
import uuid
from fastapi import UploadFile

from app.core.config import config

from PIL import Image, UnidentifiedImageError

ORIGINAL_DIR = os.path.join(config.UPLOAD_DIR, "original")
RESULT_DIR = os.path.join(config.UPLOAD_DIR, "processed")


def _generate_filename(extension: str, suffix: str = "") -> str:
    uid = uuid.uuid4()
    suffix_str = f"-{suffix}" if suffix else ""
    return f"{uid}{suffix_str}.{extension}"


def save_image(image: UploadFile) -> str:
    os.makedirs(ORIGINAL_DIR, exist_ok=True)

    extension = image.filename.split(".")[-1]
    filename = _generate_filename(extension)
    file_path = os.path.join(ORIGINAL_DIR, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(image.file.read())

    return file_path


def extract_metadata(image_path: str) -> str:
    try:
        with Image.open(image_path) as image:
            metadata = {
                "format": image.format,
                "mode": image.mode,
                "size": image.size,
                "info": image.info,
            }
        return json.dumps(metadata)
    except UnidentifiedImageError:
        return json.dumps({"error": "Invalid or unsupported image"})


def apply_grayscale(image_path: str) -> str:
    os.makedirs(RESULT_DIR, exist_ok=True)

    try:
        with Image.open(image_path) as img:
            grayscale_img = img.convert("L")
            ext = image_path.split(".")[-1]
            result_name = _generate_filename(ext, suffix="grayscale")
            result_path = os.path.join(RESULT_DIR, result_name)
            grayscale_img.save(result_path)
            return result_path
    except UnidentifiedImageError:
        raise ValueError("Unsupported image format or corrupted file")