import cv2
import os

video_path = "/Users/karma/Downloads/Cinematic_transition_luxury_202604180923.mp4"
output_dir = "/Users/karma/Antigravity/premium-keyboard-shop/public/hero-sequence"
os.makedirs(output_dir, exist_ok=True)

# Delete existing images if any
for file in os.listdir(output_dir):
    file_path = os.path.join(output_dir, file)
    if os.path.isfile(file_path):
        os.remove(file_path)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error opening video stream or file")
    exit(1)
    
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Trim start and end 5%
start_frame = int(total_frames * 0.05)
end_frame = int(total_frames * 0.95)
trimmed_frames_count = end_frame - start_frame

target_frames = 150
step_size = trimmed_frames_count / target_frames

print(f"Total frames: {total_frames}")
print(f"Start frame: {start_frame}, End frame: {end_frame}")
print(f"Target frames to extract: {target_frames}")

frame_idx = 0
saved_idx = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    if start_frame <= frame_idx < end_frame:
        current_saved_target = int((frame_idx - start_frame) / step_size)
        if current_saved_target >= saved_idx and saved_idx < target_frames:
            out_path = os.path.join(output_dir, f"frame_{saved_idx + 1:03d}.webp")
            cv2.imwrite(out_path, frame, [int(cv2.IMWRITE_WEBP_QUALITY), 100])
            saved_idx += 1
            
            if saved_idx % 25 == 0:
                print(f"Extracted {saved_idx} frames...")
                
    frame_idx += 1

cap.release()
print(f"Extraction complete! Saved {saved_idx} frames to {output_dir}")
