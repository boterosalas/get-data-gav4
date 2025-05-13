const agruparYLimpiar = (data) => {
  const agrupado = data.reduce((acc, curr) => {
    const {
      pagePath,
      ["customEvent:company"]: company,
      ["customEvent:sku"]: sku,
      ["customEvent:nombre_producto"]: nombre_producto,
      eventCount,
      totalUsers,
    } = curr;

    const existente = acc[pagePath] || {
      pagePath,
      company: "",
      sku: "",
      nombre_producto: "",
      eventCount: 0,
      totalUsers: 0,
    };

    // Solo sobrescribimos si el valor actual es válido y el anterior está vacío
    if (company !== "(not set)" && !existente.company) {
      existente.company = company;
    }
    if (sku !== "(not set)" && !existente.sku) {
      existente.sku = sku;
    }
    if (nombre_producto !== "(not set)" && !existente.nombre_producto) {
      existente.nombre_producto = nombre_producto;
    }

    // Sumar métricas
    existente.eventCount += Number(eventCount || 0);
    existente.totalUsers += Number(totalUsers || 0);

    acc[pagePath] = existente;
    return acc;
  }, {});

  const response = Object.values(agrupado).filter(
    (data) => data.sku && data.company && data.nombre_producto
  );

  return response;
};

module.exports = {
  agruparYLimpiar,
};
