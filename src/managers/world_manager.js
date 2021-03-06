import Logger from "../io/logger"
import DBManager from "../database/dbmanager"
import Map from "../database/models/map"
import WorldServer from "../network/world"
//require("babel-polyfill");

export default class WorldManager {

    static maps = [];

    static teleportClient(client, mapId, cellId, callback) {
		mapId = parseInt(mapId);
		cellId = parseInt(cellId);
		
        WorldManager.getMap(mapId, function(map) {
			if(map == null) {
				if (callback) callback(false);
			}
			else {
				if(!client.character.firstContext) client.character.getMap().removeClient(client);
				client.character.cellid = cellId;
				client.character.mapid = mapId;
				map.addClient(client);
                if (client.character.party)
                    client.character.party.sendPositionToFollowers(client.character);
				if (callback) callback(true);

			}
		});
    }

    static getMap(mapId, callback) {
        for(var i in WorldManager.maps) {
            if(WorldManager.maps[i]._id == mapId) {
                callback(WorldManager.maps[i]);
				return;
            }
        }
		DBManager.getMaps({_id: mapId}, function(maps) {
			if(maps.length > 0) {
				var map = new Map(maps[0]);
				WorldManager.maps.push(map);
				map.init();
				callback(map);
			}
			else {
				callback(null);
			}
		});
    }

	static getMapInstantly(mapId)
	{
		for(var i in WorldManager.maps) {
            if(WorldManager.maps[i]._id == mapId) {
				return WorldManager.maps[i];
            }
        }
		return null;
	}
	
	static loadSubArea(subAreaId, callback) {
		
	}

	//static async saveWorld() {
    static saveWorld() {
        WorldServer.sendTextInformationMessageToAll(1, 164, []);
        var clients = WorldServer.getAllOnlineClients();
        for (var client of clients) {
        	//await client.character.save();
            client.character.save();
		}
        WorldServer.sendTextInformationMessageToAll(1, 165, []);
	}
}