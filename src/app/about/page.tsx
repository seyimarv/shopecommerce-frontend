export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 my-16">
      <section className="text-center mb-20">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          We're your one-stop stationery shop for all things unique and
          hard-to-find!
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-700 text-lg">
          Founded in 2023, our journey began with a simple idea: to make
          beautiful, functional products that fit seamlessly into your
          lifestyle. What started as a small project has now grown into a
          beloved brand trusted by thousands of customers worldwide.
        </p>
      </section>

      <section className="mb-16 ">
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-primary text-white shadow-lg rounded-xl p-6 py-12 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
            <p className="text-lg">
              Only the finest materials go into our products.
            </p>
          </div>
          <div className="bg-primary text-white shadow-lg rounded-xl p-6 py-12 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Customer First</h3>
            <p className=" text-lg">
              We prioritize your satisfaction at every step.
            </p>
          </div>
          <div className="bg-primary text-white shadow-lg rounded-xl p-6 py-12 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
            <p className=" text-lg">
              Sustainable practices that care for the planet.
            </p>
          </div>
          <div className="bg-primary text-white shadow-lg rounded-xl p-6 py-12 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Unique Finds</h3>
            <p className=" text-lg">
              Discover rare and one-of-a-kind stationery treasures.
            </p>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg">
          Our mission is to inspire creativity and organization through
          thoughtfully designed stationery products. We believe that the right
          tools can make a world of difference in your daily life.
        </p>
      </section>
    </div>
  );
}
