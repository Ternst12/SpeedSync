import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("grainCarts.db");

export const drop = () => {
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "DROP TABLE grain_carts_match", 
            [],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const deleteCart = (id) => {
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "DELETE FROM grain_carts_match WHERE id = ?", 
            [id],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;

}

export const init = () => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "CREATE TABLE IF NOT EXISTS grain_carts_match (id INTEGER PRIMARY KEY, name TEXT NOT NULL, imageUri TEXT NOT NULL, width REAL NOT NULL, distance REAL NOT NULL, length REAL NOT NULL);", 
            [],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const insertCart = (Name, imageUri, width, distance, length) => {
    
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "INSERT INTO grain_carts_match(name, imageUri, width, distance, length) VALUES (?,?,?,?,?)", 
            [Name, imageUri, width, distance, length],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const updateCarts = (Name, imageUri, width, distance, length, id) => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "UPDATE grain_carts_match SET name = (?), imageUri = (?), width = (?), distance = (?), length = (?) WHERE id = (?) ", 
            [Name, imageUri, width, distance, length, id],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });

    })
    return promise

}

export const fetchCarts = () => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "SELECT * FROM grain_carts_match", 
            [],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });

    })
    return promise
    
}