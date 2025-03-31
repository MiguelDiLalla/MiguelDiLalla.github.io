import os
from pydub import AudioSegment

def convert_wav_to_mp3(input_path, output_path=None, bitrate='128k'):
    """
    Convert a WAV file to MP3 with specified bitrate.
    Optimized for voice quality preservation with smaller file size.
    
    Args:
        input_path (str): Path to the input WAV file
        output_path (str, optional): Path for the output MP3 file. If not specified,
                                    will use the same name as input but with .mp3 extension
        bitrate (str, optional): Bitrate for the MP3 file. For voice, 64k-128k is usually sufficient
                                Higher values = higher quality but larger files
    
    Returns:
        str: Path to the output MP3 file
    """
    # If no output path specified, create one based on input path
    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.mp3'
    
    # Load the WAV file
    print(f"Loading WAV file: {input_path}")
    audio = AudioSegment.from_wav(input_path)
    
    # Get original file size
    original_size = os.path.getsize(input_path) / (1024 * 1024)  # in MB
    
    # Convert to mono if it's stereo (since voice recordings don't need stereo)
    if audio.channels > 1:
        print("Converting to mono for voice optimization...")
        audio = audio.set_channels(1)
    
    # For voice, we can also optimize by setting a lower sample rate if it's higher than needed
    # Human voice typically doesn't need more than 22050 Hz
    if audio.frame_rate > 22050:
        print(f"Reducing sample rate from {audio.frame_rate} to 22050Hz for voice optimization...")
        audio = audio.set_frame_rate(22050)
    
    # Export to MP3
    print(f"Exporting to MP3 with bitrate: {bitrate}")
    audio.export(output_path, format="mp3", bitrate=bitrate)
    
    # Get new file size
    new_size = os.path.getsize(output_path) / (1024 * 1024)  # in MB
    
    # Print results
    print(f"\nConversion complete!")
    print(f"Original WAV: {original_size:.2f} MB")
    print(f"New MP3: {new_size:.2f} MB")
    print(f"Size reduction: {(1 - new_size/original_size) * 100:.1f}%")
    
    return output_path

if __name__ == "__main__":
    # Define the path to your audio file
    input_wav = "assets/audio/bio-podcast.wav"
    
    # Create output directory if it doesn't exist
    os.makedirs("assets/audio", exist_ok=True)
    
    # Convert the file to MP3
    # For voice, 96k bitrate is typically a good balance of quality and file size
    convert_wav_to_mp3(input_wav, bitrate='96k')
    
    # If you want to create a version optimized for slower internet connections
    convert_wav_to_mp3(input_wav, 
                      output_path=os.path.splitext(input_wav)[0] + '-low.mp3', 
                      bitrate='64k')