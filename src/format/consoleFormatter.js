function createTable(headers, rows) {
  const columnWidths = headers.map((header, index) =>
    Math.max(
      header.length,
      ...rows.map((row) => String(row[index]).length),
    ),
  );

  const separator = `+-${columnWidths.map((width) => "-".repeat(width)).join("-+-")}-+`;
  const formatRow = (row) =>
    `| ${row.map((value, index) => String(value).padEnd(columnWidths[index])).join(" | ")} |`;

  return [
    separator,
    formatRow(headers),
    separator,
    ...rows.map(formatRow),
    separator,
  ].join("\n");
}

export function formatWeatherReport(report) {
  const { city, forecast } = report;
  const { daily } = forecast;
  const temperatureUnit = forecast.temperatureUnit ?? "°C";
  const precipitationUnit = forecast.precipitationUnit ?? "мм";
  const rows = daily.time.map((date, index) => [
    date,
    daily.temperatureMin[index],
    daily.temperatureMax[index],
    daily.precipitationSum[index],
  ]);
  const table = createTable(
    [
      "Дата",
      `Мин., ${temperatureUnit}`,
      `Макс., ${temperatureUnit}`,
      `Осадки, ${precipitationUnit}`,
    ],
    rows,
  );

  return [
    `${city.name}, ${city.country}`,
    `Координаты: ${city.latitude}, ${city.longitude}`,
    `Часовой пояс: ${forecast.timezone}`,
    table,
  ].join("\n");
}
