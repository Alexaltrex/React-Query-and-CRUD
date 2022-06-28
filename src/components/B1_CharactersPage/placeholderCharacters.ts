const info = {
    count: 200,
    pages: 10,
    prev: null,
    next: null,
}

const character = {
    id: 0,
    name: "loading",
    status: "",
    species: "",
    type: "",
    gender: "",
    origin: {name: "", url: ""},
    location: {name: "", url: ""},
    image: "",
    episode: [],
    url: "",
    created: "",
}


const results = [
    character,
    character,
    character
]

export const placeholderCharacters = {
    info,
    results,
}