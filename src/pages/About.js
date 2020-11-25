import React from "react";

import Profile from "../assets/img/profile.jpg";

function About() {
  return (
    <>
      <section class="text-gray-700 body-font">
        <div class="container mx-auto flex px-5 py-20 items-center justify-center flex-col">
          <img
            class="lg:w-1/6 md:w-2/6 w-3/6 mb-10 object-cover object-center rounded-lg"
            alt="hero"
            src={Profile}
          />
          <div class="text-center lg:w-2/3 w-full">
            <h1 class="title-font sm:text-4xl md:text-3xl text-2xl mb-4 font-medium text-gray-900">
              极光面板 {process.env.REACT_APP_VERSION}
            </h1>
            <p class="mt-1 leading-relaxed">
              觉得不错的话，欢迎
              <a
                className="text-blue-500"
                href="https://github.com/aurora-admin-panel"
              >
                star
              </a>
            </p>
            <p class="mt-1 leading-relaxed">
              有什么问题，可以来
              <a
                className="text-blue-500"
                href="http://t.me/aurora_admin_panel"
              >
                telegram
              </a>
              讨论
            </p>
            <p class="mt-1 mb-5 leading-relaxed">当然，也可以请我喝杯咖啡</p>
            <div class="flex justify-center">
              <a
                class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                href="https://paypal.me/leishi1313"
              >
                PayPal
              </a>
              <a
                class="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
                href="https://github.com/sponsors/LeiShi1313/"
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
