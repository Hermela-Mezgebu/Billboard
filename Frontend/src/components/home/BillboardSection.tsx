"use client";

import Image from "next/image";

export default function BillboardSection() {
  return (
    <section className="w-full mx-auto py-10 text-white">
      <div className="w-full h-full flex flex-col items-center md:py-4 py-10">

        {/* Col - 2 */}
        <div className="xl:w-[80%] sm:w-[85%] w-[90%] mx-auto flex md:flex-row flex-col lg:gap-4 gap-2 justify-center lg:items-stretch md:items-center mt-4">

          {/* IMAGE */}
          <Image
            src="/img/billboard-6.jpg"
            alt="billboard image"
            width={600}
            height={400}
            className="md:w-[50%] w-full md:rounded-t-lg rounded-sm object-cover"
          />

          {/* TEXT */}
          <div className="md:w-[50%] w-full text-gray-400 md:p-4 p-0 rounded-md">
            <h2 className="text-3xl font-semibold text-white">
              Lorem ipsum dolor sit amet consectetur
            </h2>

            <p className="text-md mt-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore
              placeat assumenda nam veritatis, magni doloremque pariatur quos
              fugit ipsa id voluptatibus deleniti officiis cum ratione eligendi
              sed necessitatibus aliquam error laborum delectus quaerat.
              Delectus hic error eligendi sed repellat natus fuga nobis tempora
              possimus ullam!
            </p>
          </div>
        </div>

        {/* Col - 3 */}
        <div className="xl:w-[80%] sm:w-[85%] w-[90%] mx-auto flex md:flex-row flex-col flex-col-reverse lg:gap-4 gap-2 justify-center lg:items-stretch md:items-center mt-6">

          {/* TEXT */}
          <div className="md:w-[50%] w-full text-gray-400 md:p-4 p-0 rounded-md">
            <h2 className="text-3xl font-semibold text-white">
              Lorem ipsum dolor sit amet consectetur
            </h2>

            <p className="text-md mt-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore
              placeat assumenda nam veritatis, magni doloremque pariatur quos
              fugit ipsa id voluptatibus deleniti officiis cum ratione eligendi
              sed necessitatibus aliquam error laborum delectus quaerat.
              Delectus hic error eligendi sed repellat natus fuga nobis tempora
              possimus ullam!
            </p>
          </div>

          {/* IMAGE (NuxtImg → Next Image) */}
          <Image
            src="/img/billboard-6.jpg"
            alt="billboard image"
            width={600}
            height={400}
            className="md:w-[50%] w-full md:rounded-t-lg rounded-sm object-cover"
          />
        </div>

      </div>
    </section>
  );
}