<template>
    <!-- Full-width Footer -->
    <footer class="bg-gray-900 text-white py-10 mt-16 ">
      <!-- Social media section -->
      <section class="flex justify-center space-x-6 py-4 border-b border-gray-700">
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-google"></i>
        </a>
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
          <i class="fab fa-github"></i>
        </a>
      </section>
  
      <!-- Footer links section -->
      <section class="container mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <!-- Company column -->
          <div>
            <h6 class="text-xl font-bold text-white mb-4">Company Name</h6>
            <p class="text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            </p>
          </div>
  
          <!-- Products column -->
          <div>
            <h6 class="text-xl font-bold text-white mb-4">Products</h6>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">MDBootstrap</a></li>
              <li><a href="#" class="hover:text-gray-300">MDWordPress</a></li>
              <li><a href="#" class="hover:text-gray-300">BrandFlow</a></li>
              <li><a href="#" class="hover:text-gray-300">Bootstrap Angular</a></li>
            </ul>
          </div>
  
          <!-- Useful links column -->
          <div>
            <h6 class="text-xl font-bold text-white mb-4">Useful Links</h6>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">Your Account</a></li>
              <li><a href="#" class="hover:text-gray-300">Affiliate Program</a></li>
              <li><a href="#" class="hover:text-gray-300">Shipping Rates</a></li>
              <li><a href="#" class="hover:text-gray-300">Help</a></li>
            </ul>
          </div>
  
          <!-- Contact column -->
          <div>
            <h6 class="text-xl font-bold text-white mb-4">Contact</h6>
            <p class="text-gray-400"><i class="fas fa-home mr-2"></i> New York, NY 10012, US</p>
            <p class="text-gray-400"><i class="fas fa-envelope mr-2"></i> info@example.com</p>
            <p class="text-gray-400"><i class="fas fa-phone mr-2"></i> + 01 234 567 88</p>
            <p class="text-gray-400"><i class="fas fa-print mr-2"></i> + 01 234 567 89</p>
          </div>
        </div>
      </section>
  
      <!-- Copyright section -->
      <div class="text-center py-4 bg-gray-800 mt-8">
        <p class="text-gray-500">
          &copy; 2024 <span class="font-bold text-white">YourCompany</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "AppFooter",
  };
  </script>
  
  <style scoped>
  footer h6 {
    color: #fff;
  }
  
  footer a {
    transition: color 0.3s ease-in-out;
    color: #bbb;
  }
  
  footer a:hover {
    color: #fff;
  }
  
  footer p {
    color: #aaa;
  }
  
  footer i {
    margin-right: 8px;
  }
  </style>
  