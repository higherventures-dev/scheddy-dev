export default function IntegrationsPage() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Powerful Integrations</h1>
        <p className="text-gray-700 mb-4">Scheddy works seamlessly with tools your team already uses: Google Calendar, Slack, Notion, Zoom, and more.</p>
        <ul className="grid gap-4 md:grid-cols-3 list-disc pl-6 text-gray-600">
          <li>Google Workspace</li>
          <li>Slack</li>
          <li>Zoom</li>
          <li>Microsoft Teams</li>
          <li>Zapier</li>
          <li>Notion</li>
        </ul>
      </div>
    </section>
  )
}
