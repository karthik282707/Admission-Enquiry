import pdfplumber

pdf_path = "9_School_Block_Information.pdf"

print(f"Analyzing {pdf_path}...")

try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total Pages: {len(pdf.pages)}")
        
        # Analyze first page
        page = pdf.pages[0]
        text = page.extract_text()
        print("\n--- Page 1 Text Preview ---")
        print(text[:500])  # Print first 500 chars
        
        print("\n--- Page 1 Tables ---")
        tables = page.extract_tables()
        for i, table in enumerate(tables):
            print(f"Table {i+1}:")
            for row in table[:3]: # Print first 3 rows
                print(row)
                
except Exception as e:
    print(f"Error analyzing PDF: {e}")
