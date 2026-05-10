'use client';
import { useState } from 'react';
import Link from 'next/link';

const allTools = [
  { id: 'chatgpt', name: 'ChatGPT', rating: 4.8, price: '$20/mo', category: 'Writing' },
  { id: 'claude', name: 'Claude', rating: 4.7, price: '$20/mo', category: 'Writing' },
  { id: 'gemini', name: 'Gemini', rating: 4.6, price: '$20/mo', category: 'Writing' },
  { id: 'midjourney', name: 'Midjourney', rating: 4.6, price: '$10/mo', category: 'Design' },
  { id: 'copilot', name: 'GitHub Copilot', rating: 4.7, price: '$10/mo', category: 'Coding' },
  { id: 'jasper', name: 'Jasper', rating: 4.5, price: '$49/mo', category: 'Marketing' },
];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(['chatgpt', 'claude']);

  const toggleTool = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((t) => t !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  const selectedTools = allTools.filter((t) => selected.includes(t.id));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Compare AI Tools</h1>

      {/* Tool Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Select tools to compare (2-4):</h2>
        <div className="flex flex-wrap gap-3">
          {allTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selected.includes(tool.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {tool.name}
            </button>
          ))}
        </div>
        {selected.length >= 2 && (
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Compare ({selected.length} tools)
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {selectedTools.length >= 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Comparison Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {selectedTools.map((tool) => (
                    <th key={tool.id} className="py-3 px-4 text-center">
                      <Link href={`/tools/${tool.id}`} className="text-blue-600 hover:underline">
                        {tool.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Rating</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-3 px-4 text-center">⭐ {tool.rating}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Price</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-3 px-4 text-center">{tool.price}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Category</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-3 px-4 text-center">{tool.category}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Free Plan</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-3 px-4 text-center">✅ Yes</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">API Access</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-3 px-4 text-center">✅ Yes</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">🏆 Our Recommendation</h3>
            <p className="text-gray-700">
              For most users, <strong>{selectedTools[0]?.name}</strong> offers the best overall value with its powerful features and competitive pricing.
              However, if you prioritize safety and accuracy, <strong>{selectedTools[1]?.name}</strong> might be a better choice.
            </p>
            <div className="mt-4 flex gap-3">
              {selectedTools.map((tool) => (
                <a key={tool.id} href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Try {tool.name} Free
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
