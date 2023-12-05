const totalCountriesCount = document.querySelector("#countries_count");
const cardContainer = document.querySelector(".countriesCards");
const keyword = document.querySelector("#searchQuery");
const sortButtons = document.querySelectorAll(".btn__sort");
const sortBtnTxt = document.querySelectorAll(".btn__sort_txt");
const sortByNameBtn = document.querySelector("#sortByName");
const sortByCapitalBtn = document.querySelector("#sortByCapital");
const sortByPopulationBtn = document.querySelector("#sortByPopulation");
const filterResCount = document.querySelector("#searchResCount");
const filteredResWrapper = document.querySelector("#searchDetailDesc");
const statBarWrapper = document.querySelector(".statBarsWrapper");
const statBtn = document.querySelectorAll(".stat__btn");
const statDesc = document.querySelector(".statDesc");

sortBtnTxt.forEach((txt) => {
    txt.addEventListener("click", () => {
        txt.parentNode.classList.toggle("reverse__order");
    });
});
statBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        statBtn.forEach((btn) => {
            btn.classList.remove("active");
        });
        btn.classList.add("active");
    });
});

// Function to Abbreviate Large country name
const abb = (country) => {
    let omittedWords = ["of", "in", "on", "at"];
    if (country.split(" ").length >= 2) {
        let countryNameArr = country.toLowerCase().split(" ");
        countryNameArr = countryNameArr.filter(
            (namePart) => !omittedWords.includes(namePart)
        );
        return countryNameArr
            .map((name) => name.charAt(0).toUpperCase())
            .join(".");
    }
    return country;
};
const sum = (...arr) => {
    let sum = 0;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        sum += arr[i];
    }
    return sum;
};
// Function to create card with desired values in HTML format
const createCard = (flag, name, capital, lang, population) => {
    let card = document.createElement("span");
    card.classList.add("card");
    card.innerHTML = `<span class="countryFlag"><img src="${flag}" alt=""></span>
                                <span class="countryName">${name}</span>
                                <span class="countryDetail">
                                    <span class="countryCapital">Capital: <span class="countryDetailTxt">${capital}</span></span>
                                    <span class="countryLang">Languages: <span class="countryDetailTxt">${lang}</span></span>
                                    <span class="countryPopulation">Population: <span class="countryDetailTxt">${population}</span></span>
                                </span>`;
    return card;
};
// ! Function to create Bar Element
const createBarElement = (EntityName, barWidth, EntityCount) => {
    // Wrapper Element
    let wrapper = document.createElement("div");
    wrapper.classList.add("statBarElement");

    // Child Elements
    {
        // Name Element
        let name = document.createElement("span");
        name.innerText = EntityName;

        // bar Element
        let bar = document.createElement("span");
        bar.classList.add("statBar");
        bar.style.width = `${barWidth}%`;

        // count element
        let count = document.createElement("span");
        count.innerText = new Intl.NumberFormat("en-US").format(EntityCount);

        wrapper.appendChild(name);
        wrapper.appendChild(bar);
        wrapper.appendChild(count);
    }
    return wrapper;
};
// Sorting functions for Filtered Data
const sortByName = (arr) => {
    arr.sort((country1, country2) => {
        let country1Name = country1[1][1].common;
        let country2Name = country2[1][1].common;
        return country1Name < country2Name
            ? -1
            : country1Name > country2Name
            ? 1
            : 0;
    });
};
const sortByCapital = (arr) => {
    arr.sort((country1, country2) => {
        return country1[2][1].join() < country2[2][1].join()
            ? -1
            : country1[2][1].join() > country2[2][1].join()
            ? 1
            : 0;
    });
};
const sortByPopulation = (arr) => {
    arr.sort((country1, country2) => country2[4][1] - country1[4][1]);
};

fetch(
    "https://restcountries.com/v3.1/all?fields=name,languages,flags,population,capital"
)
    .then((res) => res.json())
    .then((countries) => {
        const totalCountries = countries.length;
        totalCountriesCount.innerText = totalCountries;
        let countriesArr = countries.map((countryData) =>
            Object.entries(countryData)
        );
        let filteredCountries; // ! Initializing filteredCountries Array
        let worldPopulation = sum(
            ...countriesArr.map((country) => country[4][1])
        );

        let populationList = countriesArr.map((country) => {
            let name = country[1][1].common;
            let population = country[4][1];
            return [name, population];
        });

        //   Adding World Population to population list
        populationList = [["World", worldPopulation], ...populationList]
            .sort((p1, p2) => p2[1] - p1[1])
            .slice(0, 10);
        let langList = countriesArr
            .map((country) => Object.values(country[3][1]))
            .flat(1);
        let langObj = {};
        for (const lang of langList) {
            if (langObj[lang] === undefined) {
                langObj[lang] = 1;
            } else {
                langObj[lang]++;
            }
        }
        // Top 10 Languages
        let structuredLangList = Object.entries(langObj)
            .sort((lang1, lang2) => lang2[1] - lang1[1])
            .slice(0, 10);

        statBarWrapper.innerHTML = "";
        statDesc.style.opacity = "0";
        if (statBtn[0].classList.contains("active")) {
            statDesc.innerHTML = "Population Stats of Above Countries";
            statDesc.style.opacity = "1";
            populationList.forEach((country) => {
                let countryName = abb(country[0]);
                let countryPopulation = country[1];
                let barWidth = (
                    (country[1] / populationList[0][1]) *
                    100
                ).toFixed(2);
                statBarWrapper.appendChild(
                    createBarElement(countryName, barWidth, countryPopulation)
                );
            });
        } else if (statBtn[1].classList.contains("active")) {
            statDesc.innerHTML = "Languages Stats of Above Countries";
            statDesc.style.opacity = "1";
            structuredLangList.forEach((lang) => {
                let langName = lang[0];
                let langCount = lang[1];
                let barWidth = (
                    (lang[1] / structuredLangList[0][1]) *
                    100
                ).toFixed(2);
                statBarWrapper.appendChild(
                    createBarElement(langName, barWidth, langCount)
                );
            });
        }
        // Local Function to create Cards from arr
        const cardFunc = (arr) => {
            arr.forEach((country) => {
                const flag = country[0][1].svg;
                const name = country[1][1].common;
                const capital = country[2][1].join();
                const languages = Object.values(country[3][1])
                    .slice(0, 3)
                    .join(", ");
                const population = new Intl.NumberFormat("en-US").format(
                    country[4][1]
                );
                cardContainer.appendChild(
                    createCard(flag, name, capital, languages, population)
                );
            });
        };
        // Adding Event Listeners to sort buttons
        sortButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                sortButtons.forEach((btn) => {
                    btn.classList.remove("active");
                });
                btn.classList.add("active");
            });
        });

        sortByName(countriesArr);
        cardFunc(countriesArr);

        keyword.addEventListener("input", () => {
            const query = keyword.value.trim();
            filteredResWrapper.style.opacity = "0";
            cardContainer.innerHTML = "";

            // Condition If we have something in input
            if (query === "") {
                filteredCountries = countriesArr;
                filteredCountries.forEach((country) => {
                    const flag = country[0][1].svg;
                    const name = country[1][1].common;
                    const capital = country[2][1].join();
                    const languages = Object.values(country[3][1])
                        .slice(0, 3)
                        .join(", ");
                    const population = new Intl.NumberFormat("en-US").format(
                        country[4][1]
                    );
                    cardContainer.appendChild(
                        createCard(flag, name, capital, languages, population)
                    );
                });
            } else if (query) {
                cardContainer.innerHTML = "";
                let r = new RegExp(`${query.toLowerCase()}`, "g"); // Regex for search query
                filteredCountries = countriesArr.filter((country) =>
                    r.test(country[1][1].common.toLowerCase())
                ); // Filtered Countries

                {
                    // Styling an updating Search Match Description
                    filterResCount.innerText = filteredCountries.length;
                    filteredResWrapper.style.opacity = "1";
                }

                // Creating Element for each filtered countries
                sortByName(filteredCountries);
                cardFunc(filteredCountries);
            }

            // TODO: Effect of Input on Stat bars
            {
                let worldPopulation = sum(
                    ...countriesArr.map((country) => country[4][1])
                );

                let populationList = filteredCountries
                    ? filteredCountries.map((country) => {
                          let name = country[1][1].common;
                          let population = country[4][1];
                          return [name, population];
                      })
                    : countriesArr.map((country) => {
                          let name = country[1][1].common;
                          let population = country[4][1];
                          return [name, population];
                      });

                //   Adding World Population to population list
                populationList = [["World", worldPopulation], ...populationList]
                    .sort((p1, p2) => p2[1] - p1[1])
                    .slice(0, 10);
                let langList = filteredCountries
                    ? filteredCountries
                          .map((country) => Object.values(country[3][1]))
                          .flat(1)
                    : countriesArr
                          .map((country) => Object.values(country[3][1]))
                          .flat(1);
                let langObj = {};
                for (const lang of langList) {
                    if (langObj[lang] === undefined) {
                        langObj[lang] = 1;
                    } else {
                        langObj[lang]++;
                    }
                }
                // Top 10 Languages
                let structuredLangList = Object.entries(langObj)
                    .sort((lang1, lang2) => lang2[1] - lang1[1])
                    .slice(0, 10);
                statBarWrapper.innerHTML = "";
                statDesc.style.opacity = "0";
                if (statBtn[0].classList.contains("active")) {
                    statDesc.innerHTML = "Population Stats of Above Countries";
                    statDesc.style.opacity = "1";
                    populationList.forEach((country) => {
                        let countryName = abb(country[0]);
                        let countryPopulation = country[1];
                        let barWidth = (
                            (country[1] / populationList[0][1]) *
                            100
                        ).toFixed(2);
                        statBarWrapper.appendChild(
                            createBarElement(
                                countryName,
                                barWidth,
                                countryPopulation
                            )
                        );
                    });
                } else if (statBtn[1].classList.contains("active")) {
                    statDesc.innerHTML = "Languages Stats of Above Countries";
                    statDesc.style.opacity = "1";
                    structuredLangList.forEach((lang) => {
                        let langName = lang[0];
                        let langCount = lang[1];
                        let barWidth = (
                            (lang[1] / structuredLangList[0][1]) *
                            100
                        ).toFixed(2);
                        statBarWrapper.appendChild(
                            createBarElement(langName, barWidth, langCount)
                        );
                    });
                }
            }
        });

        // * Sorting Buttons Event Listeners and DOM Manipulation Accordingly
        sortByNameBtn.addEventListener("click", () => {
            cardContainer.innerHTML = "";
            if (filteredCountries) {
                sortByName(filteredCountries);
                if (sortByNameBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(filteredCountries.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(filteredCountries);
                }
            } else {
                sortByName(countriesArr);
                if (sortByNameBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(countriesArr.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(countriesArr);
                }
            }
        });
        sortByCapitalBtn.addEventListener("click", () => {
            cardContainer.innerHTML = "";
            if (filteredCountries) {
                sortByCapital(filteredCountries);
                if (sortByCapitalBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(filteredCountries.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(filteredCountries);
                }
            } else {
                sortByCapital(countriesArr);
                if (sortByCapitalBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(countriesArr.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(countriesArr);
                }
            }
        });
        sortByPopulationBtn.addEventListener("click", () => {
            cardContainer.innerHTML = "";
            if (filteredCountries) {
                sortByPopulation(filteredCountries);
                if (sortByPopulationBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(filteredCountries.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(filteredCountries);
                }
            } else {
                sortByPopulation(countriesArr);
                if (sortByPopulationBtn.classList.contains("reverse__order")) {
                    // Reverse order filteredCountries arr
                    cardFunc(countriesArr.reverse());
                } else {
                    // No change in order of filteredCountries;
                    cardFunc(countriesArr);
                }
            }
        });

        // ? Stat Bar JS
        {
            statBtn.forEach((btn) => {
                btn.addEventListener("click", function () {
                    let worldPopulation = sum(
                        ...countriesArr.map((country) => country[4][1])
                    );

                    let populationList = filteredCountries
                        ? filteredCountries.map((country) => {
                              let name = country[1][1].common;
                              let population = country[4][1];
                              return [name, population];
                          })
                        : countriesArr.map((country) => {
                              let name = country[1][1].common;
                              let population = country[4][1];
                              return [name, population];
                          });

                    //   Adding World Population to population list
                    populationList = [
                        ["World", worldPopulation],
                        ...populationList,
                    ]
                        .sort((p1, p2) => p2[1] - p1[1])
                        .slice(0, 10);
                    let langList = filteredCountries
                        ? filteredCountries
                              .map((country) => Object.values(country[3][1]))
                              .flat(1)
                        : countriesArr
                              .map((country) => Object.values(country[3][1]))
                              .flat(1);
                    let langObj = {};
                    for (const lang of langList) {
                        if (langObj[lang] === undefined) {
                            langObj[lang] = 1;
                        } else {
                            langObj[lang]++;
                        }
                    }
                    // Top 10 Languages
                    let structuredLangList = Object.entries(langObj)
                        .sort((lang1, lang2) => lang2[1] - lang1[1])
                        .slice(0, 10);
                    statBarWrapper.innerHTML = "";
                    statDesc.style.opacity = "0";
                    if (statBtn[0].classList.contains("active")) {
                        statDesc.innerHTML =
                            "Population Stats of Above Countries";
                        statDesc.style.opacity = "1";
                        populationList.forEach((country) => {
                            let countryName = abb(country[0]);
                            let countryPopulation = country[1];
                            let barWidth = (
                                (country[1] / populationList[0][1]) *
                                100
                            ).toFixed(2);
                            statBarWrapper.appendChild(
                                createBarElement(
                                    countryName,
                                    barWidth,
                                    countryPopulation
                                )
                            );
                        });
                    } else if (statBtn[1].classList.contains("active")) {
                        statDesc.innerHTML =
                            "Languages Stats of Above Countries";
                        statDesc.style.opacity = "1";
                        structuredLangList.forEach((lang) => {
                            let langName = lang[0];
                            let langCount = lang[1];
                            let barWidth = (
                                (lang[1] / structuredLangList[0][1]) *
                                100
                            ).toFixed(2);
                            statBarWrapper.appendChild(
                                createBarElement(langName, barWidth, langCount)
                            );
                        });
                    }
                });
            });
        }
    });
