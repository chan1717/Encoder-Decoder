// Define character categories: letters, symbols, and numbers
const letters = 'abcdefghijklmnopqrstuvwxyz. ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '{', '}', '[', ']', '|', ':', ';', '"', '<', '>', ',', '?', '/', '~', '`'];

// Define codons
const codons = ['ACA', 'ACC', 'ACG', 'ACT', 'AAC', 'AGA', 'AGC', 'AGG', 'AGT', 'ATA', 'ATC', 'ATG', 'ATT',
    'CAA', 'CAC', 'CAG', 'CAT', 'CCA', 'CCC', 'CCG', 'CCT', 'CGA', 'CGC', 'CGG', 'CGT',
    'CTA', 'CTC', 'CTG', 'CTT', 'GAA', 'GAC', 'GAG', 'GAT', 'GCA', 'GCC', 'GCG', 'GCT',
    'GGA', 'GGC', 'GGG', 'GGT', 'GTA', 'GTC', 'GTG', 'GTT', 'TAC', 'TAG', 'TAT', 'TCA',
    'TCC', 'TCG', 'TCT', 'TGA', 'TGC', 'TGG', 'TGT', 'TTA', 'TTC', 'TTG', 'TTT'];

// Define prefixes for different types of characters
const prefix = ['AAA', 'AAG', 'AAT'];  // Lowercase, Uppercase, Numbers, Symbols

// Reserve codons for special use (start, stop)
const startCodon = 'ATG';  // Start codon
const stopCodon = 'TAA';  // Stop codon

// Encode function
function encode(input) {
    let k = startCodon;
    let prevType = null;

    for (let i = 0; i < input.length; i++) {
        let ch = input[i];

        if (letters.includes(ch)) {
            if (prevType !== 'letter') {
                k += prefix[0];
                prevType = 'letter';
            }
            k += codons[letters.indexOf(ch)];
        } else if (numbers.includes(ch)) {
            if (prevType !== 'number') {
                k += prefix[1];
                prevType = 'number';
            }
            k += codons[numbers.indexOf(ch)];
        } else if (symbols.includes(ch)) {
            if (prevType !== 'symbol') {
                k += prefix[2];
                prevType = 'symbol';
            }
            k += codons[symbols.indexOf(ch)];
        }
    }

    k += stopCodon;
    return k;
}

// Decode function
function decode(encoded) {
    if (!encoded.startsWith(startCodon) || !encoded.endsWith(stopCodon)) {
        return 'Error: Missing start or stop codon!';
    }

    let decoded = '';
    let i = 3;
    let currentPrefix = null;

    while (i < encoded.length - 3) {
        let triplet = encoded.slice(i, i + 3);

        if (prefix.includes(triplet)) {
            currentPrefix = triplet;
            i += 3;
            continue;
        }

        if (currentPrefix === prefix[0]) {
            decoded += letters[codons.indexOf(triplet)];
        } else if (currentPrefix === prefix[1]) {
            decoded += numbers[codons.indexOf(triplet)];
        } else if (currentPrefix === prefix[2]) {
            decoded += symbols[codons.indexOf(triplet)];
        }

        i += 3;
    }

    return decoded;
}

// Part extraction function
function extractPart(encoded) {
    let extractedPart = '';
    let foundStart = false;

    for (let i = 0; i < encoded.length; i += 3) {
        let triplet = encoded.slice(i, i + 3);

        if (triplet === startCodon && startCodon !== extractedPart) {
            extractedPart = startCodon;
            foundStart = true;
        } else if (foundStart) {
            extractedPart += triplet;
            if (triplet === stopCodon) break;
        }
    }

    return decode(extractedPart);
}

// Main function to handle user input
function process() {
    const choice = document.getElementById('choice').value;
    const inputText = document.getElementById('inputText').value;
    let output = '';

    if (choice === '1') {
        output = encode(inputText);
    } else if (choice === '2') {
        output = decode(inputText);
    } else if (choice === '3') {
        output = extractPart(inputText);
    }

    document.getElementById('output').innerText = `Result:\n${output}`;
}
