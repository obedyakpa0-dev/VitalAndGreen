const JuiceCard = ({ name, price, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
      <div className="h-40 bg-muted rounded-xl mb-4"></div>

      <h3 className="font-semibold text-xl">{name}</h3>
      <p className="text-gray-500 mt-2">
        Fresh, organic and energizing.
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-primary">{price}</span>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-gold transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default JuiceCard
