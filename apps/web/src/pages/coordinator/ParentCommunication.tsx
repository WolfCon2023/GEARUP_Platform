export default function ParentCommunication() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Parent Communication</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Bulk Message</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={5}
              placeholder="Enter your message..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}



