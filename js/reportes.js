document.addEventListener('DOMContentLoaded', function () {
    // Datos de ejemplo: porcentajes para el gráfico y cantidades reales de alumnos
    var studentPercentages = [76, 67, 85]; // Porcentajes para 1er, 2do y 3er año
    var actualStudentCounts = [120, 110, 140]; // Cantidades reales de alumnos correspondientes

    var options = {
        series: studentPercentages, // El gráfico usa estos porcentajes para dibujar los arcos
        chart: {
            height: 250, // Aumenta la altura para acomodar múltiples anillos
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 5,
                    size: '45%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.24
                    }
                },
                track: {
                    background: '#fff',
                    strokeWidth: '97%',
                    margin: 5,
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function(val, opts) {
                            // En este punto, 'val' es el porcentaje de la serie, no la cantidad de alumnos
                            // 'opts.seriesIndex' es el índice de la serie actual (0, 1, 2 para 1er, 2do, 3er año)
                            // Usamos ese índice para obtener la cantidad real del array 'actualStudentCounts'
                            if (actualStudentCounts[opts.seriesIndex] !== undefined) {
                                return actualStudentCounts[opts.seriesIndex] + ' alumnos';
                            } else {
                                return 'Datos N/A';
                            }
                        },
                        offsetY: 8,
                        color: '#111', // Color para los números de alumnos
                        fontSize: '30px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#00E396', '#FEB019', '#775DD0'], // Colores para cada serie
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['1er Año', '2do Año', '3er Año'], // Etiquetas para la leyenda
    };

    var chart = new ApexCharts(document.querySelector("#chart-alumnos"), options);
    chart.render();
});

document.addEventListener('DOMContentLoaded', function () {
    // Datos de ejemplo para los registros de autos por estado y fecha
    // Cada objeto en 'data' debe tener { x: 'Fecha', y: Cantidad }
    var chartData = {
        finalizados: [
            { x: new Date('2024-06-01').getTime(), y: 10 },
            { x: new Date('2024-06-02').getTime(), y: 12 },
            { x: new Date('2024-06-03').getTime(), y: 15 },
            { x: new Date('2024-06-04').getTime(), y: 13 },
            { x: new Date('2024-06-05').getTime(), y: 18 },
            { x: new Date('2024-06-06').getTime(), y: 20 },
            { x: new Date('2024-06-07').getTime(), y: 22 },
            { x: new Date('2024-06-08').getTime(), y: 25 },
        ],
        enProceso: [
            { x: new Date('2024-06-01').getTime(), y: 5 },
            { x: new Date('2024-06-02').getTime(), y: 8 },
            { x: new Date('2024-06-03').getTime(), y: 7 },
            { x: new Date('2024-06-04').getTime(), y: 9 },
            { x: new Date('2024-06-05').getTime(), y: 11 },
            { x: new Date('2024-06-06').getTime(), y: 10 },
            { x: new Date('2024-06-07').getTime(), y: 13 },
            { x: new Date('2024-06-08').getTime(), y: 12 },
        ],
        rechazados: [
            { x: new Date('2024-06-01').getTime(), y: 2 },
            { x: new Date('2024-06-02').getTime(), y: 3 },
            { x: new Date('2024-06-03').getTime(), y: 1 },
            { x: new Date('2024-06-04').getTime(), y: 2 },
            { x: new Date('2024-06-05').getTime(), y: 4 },
            { x: new Date('2024-06-06').getTime(), y: 3 },
            { x: new Date('2024-06-07').getTime(), y: 2 },
            { x: new Date('2024-06-08').getTime(), y: 3 },
        ]
    };

    var options = {
        series: [{
            name: 'Finalizados',
            data: chartData.finalizados
        }, {
            name: 'En Proceso',
            data: chartData.enProceso
        }, {
            name: 'Rechazados',
            data: chartData.rechazados
        }],
        chart: {
            height: 350,
            type: 'area',
            zoom: {
                enabled: false // Deshabilita el zoom por defecto si no lo necesitas
            },
            toolbar: {
                show: false // Muestra la barra de herramientas del gráfico (zoom, pan, descargar SVG/PNG)
            }
        },
        dataLabels: {
            enabled: false // No mostrar etiquetas de datos individuales en el área para evitar saturación
        },
        stroke: {
            curve: 'smooth', // Curva suave para las líneas del área
            width: 3 // Grosor de las líneas
        },
        xaxis: {
            type: 'datetime', // Indica que el eje X son fechas/horas
            labels: {
                formatter: function(value) {
                    // Formatea la fecha para que sea más legible (ej. "Jun 01")
                    const date = new Date(value);
                    return date.toLocaleString('es-ES', { month: 'short', day: 'numeric' });
                }
            },
            tooltip: {
                enabled: false // Deshabilita el tooltip del eje X si no es necesario
            }
        },
        yaxis: {
            title: {
                text: 'Cantidad de Autos', // Título para el eje Y
                style: {
                    color: '#555',
                    fontSize: '14px',
                    fontWeight: 600,
                }
            },
            labels: {
                formatter: function (value) {
                    return Math.round(value); // Asegura que los valores del eje Y sean números enteros
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy' // Formato de fecha en el tooltip
            },
            y: {
                formatter: function (val) {
                    return val + " autos"; // Añade "autos" al valor en el tooltip
                }
            }
        },
        colors: ['#00E396', '#FEB019', '#FF4560'], // Colores para Finalizados, En Proceso, Rechazados
        grid: {
            borderColor: '#e0e0e0', // Color de las líneas de la cuadrícula
            strokeDashArray: 4, // Estilo de las líneas de la cuadrícula
        },
        legend: {
            position: 'bottom', // Posición de la leyenda
            horizontalAlign: 'right', // Alineación horizontal de la leyenda
            floating: false,
            offsetY: -25, // Ajuste vertical
            offsetX: -5, // Ajuste horizontal
            fontSize: '14px',
            fontFamily: 'Roboto, Arial',
            fontWeight: 500,
            labels: {
                colors: '#333', // Color de texto de las etiquetas de la leyenda
            },
            markers: {
                width: 12,
                height: 12,
                radius: 4,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            },
        },
        responsive: [{
            breakpoint: 600, // Cuando el ancho sea menor a 600px
            options: {
                chart: {
                    height: 250 // Ajusta la altura del gráfico
                },
                legend: {
                    position: 'bottom', // Mueve la leyenda abajo
                    horizontalAlign: 'center', // Centra la leyenda
                    offsetY: 0,
                    offsetX: 0
                }
            }
        }]
    };

    var chart = new ApexCharts(document.querySelector("#chart-autos-registrados"), options);
    chart.render();
});