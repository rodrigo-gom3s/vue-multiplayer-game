<script setup>
import { defineProps, ref, computed } from 'vue';
import { Chart } from 'highcharts-vue';
import Highcharts from "highcharts";

// it is necessary to set the decimal point and thousands separator
// it wouldn't work if it wasnt set
Highcharts.setOptions({
  lang: {
    decimalPoint: ".",
    thousandsSep: ",",
  },
});


// Check if dark mode is enabled using media query
const isDarkMode = computed(() => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);


const props = defineProps({
    stats: Array,
})

const options = ref({
    chart: {
        type: "area",
        backgroundColor: isDarkMode.value ? "#1f2937" : "#fff",  // Background color based on dark mode
      },
      title: {
        text: "Games Played by Month",
        style: {
          color: isDarkMode.value ? "#fff" : "#000",  // Title color
        },
      },
      xAxis: {
        categories: props.stats.map((item) => item.month + '/' + item.year),
        labels: {
          style: {
            color: isDarkMode.value ? "#fff" : "#000",  // Axis label color
          },
        },
        lineColor: isDarkMode.value ? "#555" : "#ccc",  // Axis line color
      },
      yAxis: {
        title: {
          text: "Total Games",
          style: {
            color: isDarkMode.value ? "#fff" : "#000",  // Y-Axis title color
          },
        },
        labels: {
          style: {
            color: isDarkMode.value ? "#fff" : "#000",  // Y-Axis label color
          },
        },
        gridLineColor: isDarkMode.value ? "#444" : "#eee",  // Grid line color
        lineColor: isDarkMode.value ? "#555" : "#ccc",  // Y-Axis line color
      },
      series: [
        {
          name: "Games",
          data: props.stats.map((item) => item.total_games),
          color: isDarkMode.value ? "#00bcd4" : "#2196f3",  // Series color for dark mode
        },
      ],
      tooltip: {
        backgroundColor: isDarkMode.value ? "#333" : "#fff",  // Tooltip background color
        style: {
          color: isDarkMode.value ? "#fff" : "#000",  // Tooltip text color
        },
      },
    })
</script>

<template>
    <p v-if="stats.length == 0" class="dark:text-white text-center">
            No games registered on the platform yet.
    </p>
    <Chart v-else :options="options" />
</template>