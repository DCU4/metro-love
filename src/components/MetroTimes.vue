<script>
export default {
  data() {
    return {
      waterfrontData: null,
      columbiaHeightsData: null,
      title: 'Metro Love <3',
      noMoreTrains: false
    }
  },
  methods: {
    getMetroTimes(stationCode = 'F04') {
      let url = 'https://metro-love.vercel.app/metro-times'
      if (location.hostname === 'localhost') {
        url = 'http://localhost:8081/metro-times'
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stationCode: stationCode })
      })
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          if (data) {
            if (stationCode == 'F04') {
              this.waterfrontData = data
            } else {
              this.columbiaHeightsData = data
            }
          } else {
            this.noMoreTrains = true
          }
        })
        .catch((err) => console.log(err))
    }
  },
  created() {
    this.getMetroTimes()
    this.getMetroTimes('E04')
  }
}
</script>

<template>
  <div id="metro-times">
    <h1>{{ this.title }}</h1>
    <div
      v-if="
        (this.columbiaHeightsData === null || this.waterfrontData === null) &&
        this.noMoreTrains === false
      "
      class="spinner"
    >
      <h2>Loading Data...</h2>
      <span></span>
    </div>
    <div v-else-if="this.noMoreTrains === true"><h2>No More Trains</h2></div>
    <div v-else>
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
