<script>
export default {
  data() {
    return {
      waterfrontData: null,
      columbiaHeightsData: null
    }
  },
  methods: {
    getMetroTimes(stationCode = 'F04') {
      fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}`, {
        headers: {
          api_key: '5ea601e3fd044a21969e5c5ef3375c3c'
        }
      })
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          if (stationCode == 'F04') {
            const trains = data.Trains.filter((x) => x.DestinationName == 'Greenbelt')
            this.waterfrontData = trains
          } else {
            const trains = data.Trains.filter(
              (x) => x.DestinationName == 'Branch Ave' || x.DestinationName == 'Navy Yard-Ballpark'
            )
            this.columbiaHeightsData = trains
          }
        })
        .catch((err) => console.log(err))
    }
  },
  mounted() {
    this.getMetroTimes()
    this.getMetroTimes('E04')
  }
}
</script>

<template>
  <div id="metro-times">
    <div v-if="data === null" class="spinner">Loading Data...<span></span></div>
    <div v-else>
      <h1>Metro Love <3</h1>

      <div id="COHI" class="wrapper">
        <h2>Columbia Heights</h2>
        <header class="grid-item">
          <p>LN</p>
          <p>Desination</p>
          <p>Min</p>
        </header>
        <div
          v-for="(item, index) in this.columbiaHeightsData"
          :key="index"
          class="grid-item single-time"
        >
          <p id="green">G</p>
          <p>{{ item.DestinationName }}</p>
          <p>{{ item.Min }}</p>
        </div>
      </div>

      <div id="SW" class="wrapper">
        <h2>Waterfront</h2>
        <header class="grid-item">
          <p>LN</p>
          <p>Desination</p>
          <p>Min</p>
        </header>
        <div
          v-for="(item, index) in this.waterfrontData"
          :key="index"
          class="grid-item single-time"
        >
          <p id="green">G</p>
          <p>{{ item.DestinationName }}</p>
          <p>{{ item.Min }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1,
h2 {
  margin-bottom: 1rem;
  font-weight: bold;
}

header {
  margin-bottom: 1rem;
}

header p {
  font-weight: bold;
}

.wrapper {
  margin-bottom: 2rem;
}

.time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-item {
  display: grid;
  grid-template-columns: 20px 1fr 90px;
  gap: 2rem;
}

.single-time {
  margin-bottom: 1rem;
}

#green {
  font-size: 0;
  width: 4px;
  height: 10px;
  height: 100%;
  background-color: green;
}
</style>
