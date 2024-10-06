# 🌍 Landwatch 🚀

Welcome to the **Landwatch** — an innovative web-based application designed to seamlessly connect space-based satellite data with ground-based observations. Whether you’re a scientist, student, land manager, or an earth enthusiast, our app allows you to track **Landsat satellite** overpasses, access critical real-time environmental data, and compare it directly with your own measurements — all in one place. 

---

## 🔥 Features

- **Track Landsat Overpasses**  
  Define a target location and receive notifications when Landsat satellites (Landsat 8 & 9) will pass over your area.

- **Access Surface Reflectance Data**  
  Instantly access and download Landsat Surface Reflectance (SR) data for your location to monitor changes in Earth's surface.

- **Compare with Ground-Based Observations**  
  Compare satellite SR data with your own field measurements to validate and explore environmental changes in real-time.

- **Interactive Map Integration**  
  Select your target location on a dynamic map, and visualize the Landsat scene extent, including a 3x3 grid of 9 Landsat pixels centered on your location.

- **Customizable Notifications**  
  Set custom alerts based on lead time for satellite passes and cloud coverage thresholds to get data tailored to your needs.

- **Visualize Spectral Data**  
  Display and analyze Landsat SR data in graph form to better understand the spectral signature of Earth's surface.

- **Download Data**  
  Export valuable Landsat SR data and metadata, including acquisition date, satellite info, cloud cover, and more, in CSV format.

---

## 🌟 Why is it Important?

The **Landsat Explorer** app merges the powerful capabilities of Landsat satellite data, creating a bridge between space and Earth. Whether you're in the classroom or out in the field, this tool empowers you to:

- **Enhance Remote Sensing Education**  
  Compare your own spectral measurements with real satellite data, fostering a deeper understanding of Earth's changes.

- **Support Scientific Discovery**  
  Assist researchers, land managers, and citizen scientists in tracking environmental trends and validating satellite observations.

- **Empower Global Citizenship**  
  Give users an informed, hands-on approach to understanding and monitoring the planet in real-time.

---

## 🚀 How to Get Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/exe-0535/landwatch.git
   ```

## 🖥️ Launch Server
   
1. **Install Dependencies**
   ```bash
   cd landwatch -> BACKEND 
   pip install -r requirements.txt
   ```
2. **Run Server**
   ```bash
   cd BACKEND -> src
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver 8001
   ```
   Make sure that the port is 8001

## 🗄️ How to Run Client

1. **Install Dependencies**
   ```bash
   cd landwatch -> FRONTEND 
   npm install 
   ```
2. **Run Client**
   ```bash
   npm run dev
   ```
3. **Open App**
   <a href="http://localhost:3000/">http://localhost:3000/</a>
---

## 🔧 Tech Stack

- **Frontend**: React, Next.js, Leaflet.js (for interactive maps)
- **Backend**: Python, Django
- **API**: NASA Earthdata API (for Landsat SR data retrieval)
- **Database**: PostgreSQL (for storing user preferences and notifications)

---

## 🛠️ Future Features

- **Enhanced Data Filtering**: Add more granular options for data retrieval based on specific time spans, cloud cover, and image quality.
- **Advanced Data Export Options**: Allow users to export data in more formats, including GeoTIFF and JSON.

---

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

---

Bring the cosmos to your fingertips.  
**Explore Earth, one Landsat pass at a time.** 🌍🚀

---

