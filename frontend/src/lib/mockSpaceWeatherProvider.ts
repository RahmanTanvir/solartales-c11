// Mock Space Weather Data Provider for development/fallback
export class MockSpaceWeatherProvider {
  static getCurrentSpaceWeather() {
    return {
      kIndex: {
        current: 3.2,
        data: this.generateKIndexData(),
        status: 'Minor Storm'
      },
      solarWind: {
        speed: 425,
        density: 8.5,
        temperature: 85000,
        bz: -5.2,
        status: 'Elevated'
      },
      aurora: {
        forecast: "Aurora activity possible at high latitudes",
        viewline: 65,
        lastUpdate: new Date().toISOString()
      },
      scales: {
        geomagnetic: "G1 - Minor",
        solar: "S1 - Minor", 
        radio: "R1 - Minor"
      },
      lastUpdate: new Date().toISOString()
    };
  }

  static getSolarFlares() {
    return [
      {
        flrID: "2025-08-20T12:00:00-FLR-001",
        beginTime: "2025-08-20T12:00Z",
        peakTime: "2025-08-20T12:15Z",
        endTime: "2025-08-20T12:30Z",
        classType: "M2.1",
        sourceLocation: "S15W45",
        activeRegionNum: 13825,
        linkedEvents: []
      },
      {
        flrID: "2025-08-19T08:30:00-FLR-002", 
        beginTime: "2025-08-19T08:30Z",
        peakTime: "2025-08-19T08:45Z",
        endTime: "2025-08-19T09:15Z",
        classType: "C8.7",
        sourceLocation: "N20E15",
        activeRegionNum: 13823,
        linkedEvents: []
      }
    ];
  }

  static getCMEs() {
    return [
      {
        activityID: "2025-08-20T14:00:00-CME-001",
        catalog: "M2CFlower",
        startTime: "2025-08-20T14:00Z",
        sourceLocation: "S15W45",
        activeRegionNum: 13825,
        speed: "450",
        type: "C",
        isMostAccurate: true,
        linkedEvents: []
      }
    ];
  }

  static getGeomagneticStorms() {
    return [
      {
        gstID: "2025-08-20T18:00:00-GST-001",
        startTime: "2025-08-20T18:00Z",
        allKpIndex: [
          {
            observedTime: "2025-08-20T18:00Z",
            kpIndex: "4",
            source: "NOAA"
          },
          {
            observedTime: "2025-08-20T21:00Z",
            kpIndex: "3",
            source: "NOAA"
          }
        ],
        linkedEvents: []
      }
    ];
  }

  static getRadioBlackouts() {
    return [
      {
        rbeID: "2025-08-20T12:15:00-RBE-001",
        beginTime: "2025-08-20T12:15Z",
        endTime: "2025-08-20T12:45Z",
        classType: "R1",
        freqType: "HF",
        linkedEvents: []
      }
    ];
  }

  static getSolarImages() {
    return [
      {
        date: "2025-08-20",
        title: "Solar Dynamics Observatory - Sun Today",
        explanation: "The Sun captured by NASA's Solar Dynamics Observatory showing current solar activity including sunspots and solar flares.",
        url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_2048_0171.jpg",
        hdurl: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_4096_0171.jpg",
        media_type: "image",
        service_version: "v1"
      }
    ];
  }

  private static generateKIndexData() {
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(Date.now() - i * 3 * 60 * 60 * 1000);
      data.push({
        time_tag: time.toISOString(),
        kp: (Math.random() * 4 + 1).toFixed(1),
        kp_index: (Math.random() * 4 + 1).toFixed(1)
      });
    }
    return data;
  }

  static getAllSpaceWeatherData() {
    return {
      currentConditions: this.getCurrentSpaceWeather(),
      solarFlares: this.getSolarFlares(),
      cmes: this.getCMEs(),
      geomagneticStorms: this.getGeomagneticStorms(),
      radioBlackouts: this.getRadioBlackouts(),
      solarImages: this.getSolarImages(),
      lastUpdate: new Date().toISOString(),
      isDemo: true
    };
  }
}
