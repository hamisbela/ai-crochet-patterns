import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to AI Crochet Patterns, your go-to resource for AI-powered crochet pattern generation.
            We're passionate about making crochet more accessible and helping crafters recreate beautiful projects
            through technology that transforms photos into detailed, easy-to-follow patterns.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make crochet pattern creation accessible to everyone by providing a free, easy-to-use
            pattern generator. We aim to help crocheters of all skill levels recreate projects they love,
            document their own designs, and explore new possibilities in the fiber arts world.
            Our tool is designed to support the crochet community by removing barriers to pattern creation and
            helping more people enjoy this wonderful craft.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI crochet pattern recognition</li>
            <li>Detailed yarn and hook recommendations</li>
            <li>Clear row-by-row instructions with stitch counts</li>
            <li>Customization suggestions and variations</li>
            <li>Suitable for all skill levels from beginner to advanced</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this crochet pattern generator free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            crochet enthusiasts who want to create and share beautiful handmade projects.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=ai-crochet-pattern"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}