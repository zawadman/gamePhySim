export class TileNode {

	static Type = Object.freeze({
		Grass: Symbol("grass"),
		Sand: Symbol("sand"),
		Water: Symbol("water")
	})


	// Node Constructor
	constructor(id, x, z, type) {
		this.id = id;
		this.x = x;
		this.z = z;

		this.edges = [];

		this.type = type;

		// Added!
		this.elevation = 0;

	}

	// Try to add an edge to this node
	tryAddEdge(node, cost) {
		if (node.type != TileNode.Type.Water) {
			this.edges.push({node: node, cost: cost});
		}
	}

	// Test if this node has an edge to the neighbour
	getEdge(node) {
		return this.edges.find(x => x.node === node);
	}

	// Test if edge by direction exists
	hasEdge(node) {
		if (this.getEdge(node) === undefined)
			return false;
		return true;

	}

	// Test if has edge to a particular location
	hasEdgeTo(x, z) {
		let edge = this.getEdgeTo(x,z);
		if (edge === undefined)
			return false;
		return true;
	}

	// Get an edge to a particular location
	getEdgeTo(x, z) {
		return this.edges.find(e => (e.node.x === x) && (e.node.z === z));
	}


	// Log method
	log() {
		let s = this.id + ": \n";
		for (let index in this.edges) {
			s += "-- " + this.edges[index].node.id + ": " + this.edges[index].cost + ", ";
		}
		s = s.slice(0, -2);
		console.log(s);
	}
}