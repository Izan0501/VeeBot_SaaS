import io
from pypdf import PdfReader

def robust_extract(file_content: bytes) -> str:
    """
    Intenta extraer texto de un archivo PDF (bytes) de forma robusta.
    """
    try:
        # 1. Convertir los bytes crudos a un stream de archivo
        file_stream = io.BytesIO(file_content)
        
        # 2. Leer el PDF
        reader = PdfReader(file_stream)
        full_text = []

        # 3. Iterar por páginas
        for page in reader.pages:
            text = page.extract_text()
            if text:
                full_text.append(text)
        
        # 4. Unir todo
        extracted_text = "\n".join(full_text)
        
        # 5. Validación final
        if not extracted_text or len(extracted_text.strip()) < 50:
            print("⚠️ ADVERTENCIA: Se extrajo muy poco texto. ¿Es un PDF escaneado (imagen)?")
            return ""

        return extracted_text

    except Exception as e:
        print(f"❌ Error fatal extrayendo texto del PDF: {e}")
        return ""