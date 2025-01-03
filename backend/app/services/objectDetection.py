# app/services/objectDetection.py
import torch
from ram.models import ram_plus
from ram import inference_ram as inference
from ram import get_transform
from PIL import Image
import os

# 디바이스 설정
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 모델 로드

model_path = "C:/Users/201-19/Desktop/alssongdalssong/backend/ram_plus_swin_large_14m.pth"

if not os.path.exists(model_path):
    raise FileNotFoundError(f"모델 파일을 찾을 수 없습니다: {model_path}")

model = ram_plus(pretrained=model_path, image_size=384, vit='swin_l')
model.eval()
model = model.to(device)

# 추론 함수
def detect_objects(image_path: str):
    """
    이미지에서 객체를 감지
    :param image_path: 이미지 파일 경로
    :return: 가장 신뢰도 높은 객체 이름
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")

    try:
        # 이미지 변환 및 모델 추론
        transform = get_transform(image_size=384)
        image = transform(Image.open(image_path)).unsqueeze(0).to(device)
        res = inference(image, model)

        if res and len(res[0]) > 0:
            result = res[0].split("|")
            return result[0]
        else:
            return "No objects detected."
    except Exception as e:
        raise RuntimeError(f"모델 추론 중 오류 발생: {str(e)}")
