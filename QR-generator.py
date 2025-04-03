# This script generates QR codes for a list of URLs and saves them as PNG or SVG files in its own directory.

# when executed ask for the URL to generate a QR code for as input in the console

# it uses rich logging and colorama for colored output in the console
# it uses qrcode for generating the QR codes

import qrcode
from qrcode.image.svg import SvgPathImage
import os
import sys
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress
from rich.prompt import Prompt
from colorama import init, Fore, Style

# Initialize colorama
init()

# Create Rich console
console = Console()

def generate_qr_code(url, filename=None, format="png"):
    """Generate a QR code for the given URL and save it as a PNG or SVG file.
    
    Args:
        url (str): The URL to encode in the QR code
        filename (str, optional): Output filename. If not provided, one will be generated
        format (str, optional): Output format - 'png' or 'svg'. Defaults to 'png'
    
    Returns:
        str: The filename of the saved QR code
    """
    if not filename:
        # If no filename is provided, use the URL as the filename (removing some invalid characters)
        filename = url.replace("https://", "").replace("http://", "").replace("/", "_").replace(".", "_")
        filename = f"{filename}.{format.lower()}"
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    
    # Add data to the QR code
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create an image from the QR code
    with Progress() as progress:
        task = progress.add_task("[cyan]Generating QR code...", total=100)
        
        # Simulate progress steps
        progress.update(task, advance=25)
        
        # Choose the appropriate image factory based on format
        if format.lower() == "svg":
            img = qr.make_image(image_factory=SvgPathImage)
        else:  # Default to PNG
            img = qr.make_image(fill_color="black", back_color="white")
        
        progress.update(task, advance=50)
        
        # Save the image
        img.save(filename)
        progress.update(task, advance=25)
    
    return filename

def main():
    console.print(Panel.fit(
        "[bold yellow]QR Code Generator[/bold yellow]\n"
        "[cyan]This script generates QR codes for URLs and saves them as PNG or SVG files.[/cyan]",
        border_style="yellow"
    ))
    
    try:
        while True:
            console.print("\n[bold blue]Enter a URL to generate a QR code (or 'exit' to quit):[/bold blue]")
            url = input(f"{Fore.GREEN}> {Style.RESET_ALL}")
            
            if url.lower() in ['exit', 'quit', 'q']:
                console.print("[bold yellow]Exiting QR code generator. Goodbye![/bold yellow]")
                break
                
            if not url.startswith(('http://', 'https://')):
                url = f"https://{url}"
                console.print(f"[yellow]URL adjusted to: {url}[/yellow]")
            
            # Prompt for file format
            format_choice = Prompt.ask(
                "[bold blue]Choose output format",
                choices=["png", "svg"],
                default="png"
            )
            
            console.print(f"[cyan]Generating {format_choice.upper()} QR code for:[/cyan] [bold]{url}[/bold]")
            
            try:
                filename = generate_qr_code(url, format=format_choice)
                full_path = os.path.abspath(filename)
                
                console.print(f"[bold green]Success![/bold green] QR code saved as:")
                console.print(f"[bold white on blue]{full_path}[/bold white on blue]")
            except Exception as e:
                console.print(f"[bold red]Error generating QR code:[/bold red] {str(e)}")
                
    except KeyboardInterrupt:
        console.print("\n[bold yellow]QR code generator interrupted. Goodbye![/bold yellow]")
    except Exception as e:
        console.print(f"[bold red]An unexpected error occurred:[/bold red] {str(e)}")
        return 1
        
    return 0

if __name__ == "__main__":
    sys.exit(main())

