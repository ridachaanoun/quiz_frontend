<template>
    <div id="particles-js"></div>
  </template>
  
  <script>
  import { particlesJS } from 'particles.js';
  
  export default {
    name: 'ParticlesJs',
    mounted() {
      if (particlesJS) {
        particlesJS('particles-js', {
          "particles": {
            "number": {
              "value": 100,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#16db65"
            },
            "shape": {
              "type": "triangle",
              "stroke": {
                "width": 1,
                "color": "#16db65"
              },
              "polygon": {
                "nb_sides": 5
              },
              "opacity": {
                "value": 0.35,
                "random": false
              },
              "size": {
                "value": 5,
                "random": true
              },
              "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
              },
              "move": {
                "enable": true,
                "speed": 9,
                "direction": "none",
                "random": false
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": true,
                  "mode": "repulse"
                },
                "onclick": {
                  "enable": true,
                  "mode": "push"
                },
                "resize": true
              },
              "modes": {
                "grab": {
                  "distance": 400,
                  "line_linked": {
                    "opacity": 1
                  }
                },
                "bubble": {
                  "distance": 400,
                  "size": 40,
                  "duration": 2,
                  "opacity": 0.1,
                  "speed": 3
                },
                "repulse": {
                  "distance": 200,
                  "duration": 0.4
                },
                "push": {
                  "particles_nb": 4
                },
                "remove": {
                  "particles_nb": 2
                }
              }
            },
            "retina_detect": true
          }
        });
      } else {
        console.error('particles.js library is not loaded.');
      }
    }
  };
  </script>
  
  <style>
  #particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  </style>
  