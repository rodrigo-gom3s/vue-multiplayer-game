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
    stats: Object,
})

const getAllMonths = (wins, losses) => {
    const allMonths = new Set();

    wins.forEach(item => {
      allMonths.add(item.month + '/' + item.year);
    });
    losses.forEach(item => {
      allMonths.add(item.month + '/' + item.year);
    });

    return Array.from(allMonths);
  }


const options = ref({
    chart: {
        type: "column",
        backgroundColor: isDarkMode.value ? "#1f2937" : "#fff",  // Background color based on dark mode
      },
      title: {
        text: "Multiplayer Games Played by Month",
        style: {
          color: isDarkMode.value ? "#fff" : "#000",  // Title color
        },
      },
      xAxis: {
        categories: getAllMonths(props.stats.wins_per_month, props.stats.losses_per_month),
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
          name: "Wins",
          data: props.stats.wins_per_month.map((item) => item.total_wins),
          color: isDarkMode.value ? "#00bcd4" : "#2196f3",  // Series color for dark mode
        },
        {
          name: "Losses",
          data: props.stats.losses_per_month.map((item) => item.total_losses),
          color: "red",  // Series color for dark mode
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
    <p v-if="stats.wins_per_month.length == 0 && stats.losses_per_month.length == 0" 
            class="dark:text-white m-6 text-center">
        No data about wins and losses available to show in a graph.
    </p>
    <Chart v-else :options="options" />
</template>