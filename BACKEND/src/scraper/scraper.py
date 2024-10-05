import os
import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def scrape_passes_selenium(driver_path, browser='chrome'):
    url = f"https://www.n2yo.com/passes/?s=39084#"
    
    if browser.lower() == 'chrome':
        options = ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_argument('--no-sandbox')
        options.add_argument("--headless=old")
        options.add_argument('--disable-dev-shm-usage')
        service = ChromeService(executable_path=driver_path)
        driver = webdriver.Chrome(service=service, options=options)
    elif browser.lower() == 'firefox':
        options = FirefoxOptions()
        options.add_argument('--headless')
        service = FirefoxService(executable_path=driver_path)
        driver = webdriver.Firefox(service=service, options=options)
    else:
        raise ValueError("Unsupported browser! Choose 'chrome' or 'firefox'.")
    
    try:
        driver.get(url)
        print("Loading the webpage...")

        wait = WebDriverWait(driver, 20)

        wait.until(EC.presence_of_element_located((By.ID, 'passestable')))
        print("Table found!")

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '#passestable tbody tr')))
        print("At least one row is present in the table.")

        table_element = driver.find_element(By.ID, 'passestable')
        driver.execute_script("arguments[0].scrollIntoView();", table_element)
        time.sleep(2)

        html = driver.page_source

    except Exception as e:
        print(f"An error occurred while loading the page: {e}")
        driver.quit()
        raise e

    finally:
        driver.quit()

    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table', id='passestable')

    if not table:
        raise ValueError("Could not find the table with id 'passestable' on the page.")

    data = []
    tbody = table.find('tbody')

    if not tbody:
        raise ValueError("The table does not contain a <tbody> section.")

    rows = tbody.find_all('tr')
    if not rows:
        raise ValueError("No rows found in the table's <tbody>.")

    for idx, row in enumerate(rows, start=1):
        cols = row.find_all('td')
        if len(cols) < 6:
            print(f"Warning: Row {idx} does not have enough columns. Skipping.")
            continue

        start_date_time = cols[0].get_text(separator=' ', strip=True)
        end_local_time = cols[5].get_text(strip=True)

        data.append({
            'Start Date and Time': start_date_time,
            'End Local Time': end_local_time
        })

    return data

def save_to_csv(data, filename):
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Start Date and Time', 'End Local Time']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for entry in data:
                writer.writerow(entry)
        print(f"Data successfully saved to {filename}")
    except IOError as e:
        print(f"Error writing to CSV file: {e}")
        raise e

def main(output_file='passes_extended.csv', browser='chrome'):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    driver_path = os.path.join(current_dir, 'chromedriver.exe')  # Ensure chromedriver.exe is in the scraper directory
    
    passes = scrape_passes_selenium(driver_path, browser=browser)

    if passes:
        print(f"Found {len(passes)} pass entries.")
        save_to_csv(passes, output_file)
        return passes  # Return the data for further processing
    else:
        print("No data found to save.")
        return []
