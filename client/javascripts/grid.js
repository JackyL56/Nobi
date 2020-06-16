"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Grid extends Array {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "colourArray", ['#FFFFFF', '#0000FF', '#FF0000', '#FFFF00', '#00FF00', '#FF8000', '#FF00FF', '#414141', '#00FFFF','#006700', '#6D2E0B', '#FF7777', '#6C006C', '#B2B2B2', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC', '#66994D']);

    _defineProperty(this, "colourArrayDark", ['#FFFFFF', '#0000CC', '#CC0000', '#CCCC00', '#00CC00', '#CC4D00', '#CC00CC', '#0E0E0E', '#00CCCC','#003400',  '#3A0000', '#CC4444', '#390039', '#7F7F7F', '#336600', '#CC66B3', '#99CC00', '#CC0033', '#B30000', '#00CC99', '#33661A']);
  }

  static isValidHex(value) {
    return (value || {}).__isHex === true;
  }

  push(...hexes) {
    return super.push(...hexes.filter(Grid.isValidHex));
  }

  createMapHex(size) {
    let q,
        r,
        s,
        len = size - 1,
        colour = 0;

    for (q = -len; q < len + 1; q++) {
      for (r = -len; r < len + 1; r++) {
        for (s = -len; s < len + 1; s++) {
          if (Math.round(q + r + s) === 0) {
            this.push(Hex(q, r, s, colour));
          }
        }
      }
    }
  }
  /**
   *   Array of Colours
   */


  getHexColour(Hex) {
    return this.colourArray[Hex.colour];
  }

  getHintColour(Hex) {
    return this.colourArrayDark[Hex.colour];
  }

  getColourByIndex(index) {
    return this.colourArray[index];
  } // Checks if hex1 and hex2 are neighbours


  areNeighbours(hex1, hex2) {
    if (getDirection(hex1.q - hex2.q, hex1.r - hex2.r)) {
      // Only returns a direction, if hex1 is in a direction of length 1 (neighbour) to hex2
      return true;
    }

    return false;
  }

  noTriplets(hex, colour) {
    let noTriplet = true; // Getting the neighbours of hex

    for (const key in hexDirections) {
      if (hexDirections.hasOwnProperty(key)) {
        const element = hexDirections[key]; // If the neighbour exists

        if (this.getHex(hex.q + element[0], hex.r + element[1])) {
          if (this.noTripletsInDirectionClockwise(hex, element, colour) == false) {
            noTriplet = false;
          }
        }
      }
    }

    return noTriplet;
  } // Checks if the neighbour in the given direction and his neighbour in a clockwise direction relative to the source Hexagon have the same colour. 
  // Returns true if the neighbours do not have the same colour as the source colour


  noTripletsInDirectionClockwise(source, direction, colour) {
    // Stores the two neighbours
    let neighbours = []; // Each pair of Hexagons has two or less neighbouring hexagons

    switch (direction) {
      // We assume the hexagonal board is top-flat oriented
      // TOP LEFT
      case hexDirections.TOP_LEFT:
        neighbours.push(hexDirections.TOP_LEFT);
        neighbours.push(hexDirections.TOP_RIGHT);
        break;
      // TOP RIGHT

      case hexDirections.TOP_RIGHT:
        neighbours.push(hexDirections.TOP_RIGHT);
        neighbours.push(hexDirections.RIGHT);
        break;
      // RIGHT

      case hexDirections.RIGHT:
        neighbours.push(hexDirections.RIGHT);
        neighbours.push(hexDirections.BOTTOM_RIGHT);
        break;
      // BOTTOM RIGHT  

      case hexDirections.BOTTOM_RIGHT:
        neighbours.push(hexDirections.BOTTOM_RIGHT);
        neighbours.push(hexDirections.BOTTOM_LEFT);
        break;
      // BOTTOM LEFT

      case hexDirections.BOTTOM_LEFT:
        neighbours.push(hexDirections.BOTTOM_LEFT);
        neighbours.push(hexDirections.LEFT);
        break;
      // LEFT

      case hexDirections.LEFT:
        neighbours.push(hexDirections.LEFT);
        neighbours.push(hexDirections.TOP_LEFT);
        break;
    }

    let noTriplets = true; // Compare the colours of both neighbours
    // If the neighbour exists

    let n0 = this.getHex(source.q + neighbours[0][0], source.r + neighbours[0][1]);
    let n1 = this.getHex(source.q + neighbours[1][0], source.r + neighbours[1][1]); // If both exist

    if (n0 && n1) {
      if (n0.colour == colour && n1.colour == colour) {
        noTriplets = false;
      }
    }

    return noTriplets;
  } // Return Hex in the grid given their q and r coordinates


  getHex(q, r) {
    const hex = this.find(hex => hex.q === q && hex.r === r && hex.s === -q - r);
    return hex;
  }
  /**
    * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf|Array#indexOf},
    * but accepts a {@link point} and internally uses {@link Hex#equals} as a comparator.
    *
    * @memberof Grid#
    * @override
    *
    * @param {point} point             The coordinates to search for.
    * @param {number} [fromIndex=0]    Optional index to start searching.
    *                                  If negative, it is taken as the offset from the end of the grid.
    *
    * @returns {number}                The index of the found hex (first from the left) or -1 if the hex wasn't found.
    *
    * @example
    * const Grid = Honeycomb.defineGrid()
    * const Hex = Grid.Hex
    * const grid = Grid(Hex(0), Hex(1), Hex(0))
    * // [
    * //    { x: 0, y: 0 },
    * //    { x: 1, y: 1 },
    * //    { x: 0, y: 0 }
    * // ]
    *
    * grid.indexOf(Hex(0))     // 0
    * grid.indexOf([0, 0])     // 0
    * grid.indexOf(Hex(0), 1)  // 2
    * grid.indexOf(Hex(5, 7))  // -1
    */


  indexOf(point, fromIndex = 0) {
    const {
      length
    } = this;
    let i = Number(fromIndex);
    point = Point(point);
    i = Math.max(i >= 0 ? i : length + i, 0);

    for (i; i < length; i++) {
      if (this[i].equals(point)) {
        return i;
      }
    }

    return -1;
  }
  /**
   * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf|Array#lastIndexOf},
   * but accepts a {@link point} and internally uses {@link Hex#equals} as a comparator.
   *
   * Because all hexes will have different coordinates in most grids, this method behaves the same as {@link Grid#indexOf}.
   * This method might have a slightly better performance if you know the search hex is at the end of the grid.
   *
   * @memberof Grid#
   * @override
   *
   * @param {point} point                 The coordinates to search for.
   * @param {number} [fromIndex=length-1] Optional index to start searching back from.
   *                                      If negative, it is taken as the offset from the end of the grid.
   *
   * @returns {number}                    The last index of the found hex or -1 if the hex wasn't found.
   *
   * @example
   * const Grid = Honeycomb.defineGrid()
   * const Hex = Grid.Hex
   * const grid = Grid(Hex(0), Hex(1), Hex(0))
   * // [
   * //    { x: 0, y: 0 },
   * //    { x: 1, y: 1 },
   * //    { x: 0, y: 0 }
   * // ]
   *
   * grid.lastIndexOf(Hex(0))     // 2
   * grid.lastIndexOf([0, 0])     // 2
   * grid.lastIndexOf(Hex(0), 1)  // 0
   * grid.lastIndexOf(Hex(5, 7))  // -1
   */


  lastIndexOf(point, fromIndex = this.length - 1) {
    const {
      length
    } = this;
    let i = Number(fromIndex);
    point = Point(point);
    i = i >= 0 ? Math.min(i, length - 1) : length + i;

    for (i; i >= 0; i--) {
      if (this[i].equals(point)) {
        return i;
      }
    }

    return -1;
  }

}