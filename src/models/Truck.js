const {DataTypes } = require("sequelize");
const sequelize = require('../connection.js');


// Modelo de Camiones

const Truck = sequelize.define("Trucks", {
   
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    code: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debes introducir el codigo del articulo' 
            }
        }
    },

    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debes ingresar el nombre del articulo'
            },
            notNull: {
                msg: 'Debes ingresar el nombre del articulo'
            }
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "La descripcion del articulo es obligatoria"
            }
        }
    },

    date_purchase: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de compra ingresada no es correcta"
            },
            notNull: {
                msg: "Debes ingresar la fecha de compra del articulo"
            },
            notEmpty: {
                msg: "Debes ingresar la fecha de compra del articulo"
            }
        }
    },

    category: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Debes ingresar la categoria del articulo"
            },
            notEmpty: {
                args: true,
                msg: "Debes ingresar la categoria del articulo"
            },
        }
    },

    model: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Debes ingresar el modelo del articulo"
            },
            notEmpty: {
                args: true,
                msg: "Debes ingresar el modelo del articulo"
            },
        }
    },

    vendor: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Debes ingresar vendedor del articulo"
            },
            notEmpty: {
                args: true,
                msg: "Debes ingresar el vendedor del articulo"
            },
        }
    },

    is_sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    },

    sale_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isDate: {
                msg: "La fecha de venta ingresada no es correcta"
            },
            notNull: {
                msg: "Debes ingresar la fecha de venta del articulo"
            },
            notEmpty: {
                msg: "Debes ingresar la fecha de venta del articulo"
            }
        }
    },

    transport_cost: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Debes ingresar el costo de transporte"
            },
        }
    },

    workforce: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },

    cost: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: "Debes ingresar el costo del articulo"
            }
        }
    },


    total: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },


    createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    
    updatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

});

module.exports = Truck;