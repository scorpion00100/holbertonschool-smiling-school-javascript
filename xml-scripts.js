$(document).ready(function () {
    function addNewQuotes(picUrl, name, title, text, index) {
        $(".section-quote .carousel-inner").append(`
            <div class="carousel-item ${index == 0 ?`active` : ``}">
                <div class="row justify-content-between">
                    <div class="col-sm-4 text-center text-md-right my-auto pr-md-5">
                        <img src="${picUrl}" alt="slide" class="rounded-circle" height="160px" weight="160px">
                    </div>
                    <div class="col-sm-8 py-2">
                        <p class="mt-5 mt-sm-0 pl-md-2">${text}</p>
                        <p class="font-weight-bold mb-n1 mt-5">${name}</p>
                        <p><em>${title}</em></p> 
                    </div>
                </div>  
            </div>
        `);
    }

    function addNewCard(author, picUrl, thumbUrl, stars, title, subTitle, duration, index, selector) {
        $(selector).append(`
            <div class="carousel-item ${index == 0 ?`active` : ``} col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card border-0" style="max-width: 25.5rem;">
                    <div class="position-relative image-group">
                        <img src="./images/play.png" alt="play" width="64px" class="play position-absolute">
                    <img src="${thumbUrl}" alt="card-1" class="card-img-top img-fluid" height="154px">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${title}</h5>
                        <p class="card-text text-muted">${subTitle}</p>
                        <div class="row justify-content-start align-items-center p-4">
                            <img src="${picUrl}" alt="${author}" width="30px" class="rounded-circle mr-4">
                            <p class="m-0 font-weight-bold">${author}</p>
                        </div>
                        <div class="row justify-content-between px-4">
                            <div class="d-inline-block">
                                ${displayStars(stars)}
                            </div>
                            <p class="font-weight-bold">${duration}</p>
                        </div>
                    </div>
                </div>      
            </div>
        `);
    }
    
    function addNewCourse(thumbUrl, title, subTitle, picUrl, author, stars, duration) {
        $("#matchingCourses").append(`
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mt-4">
                <div class="card border-0">
                    <div class="position-relative image-group">
                        <img src="./images/play.png" alt="play" width="64px" class="play position-absolute">
                        <img src="${thumbUrl}" alt="card-1" class="card-img-top img-fluid" height="154px">
                    </div>
                    <div class="card-body">
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${title}</h5>
                            <p class="card-text text-muted">${subTitle}</p>
                            <div class="row justify-content-start align-items-center p-4">
                                <img src="${picUrl}" alt="Phillip Massay" width="30px" class="rounded-circle mr-4">
                                <p class="m-0 font-weight-bold">${author}</p>
                            </div>
                            <div class="row justify-content-between px-4">
                                <div class="d-inline-block">
                                    ${displayStars(stars)}
                                </div>
                                <p class="font-weight-bold">${duration}</p>
                            </div>
                        </div>
                    </div> 
                </div>   
            </div>
        `);
    }

    function displayStars(number) {
        let string = "";

        if (number > 5) {
            number = 5;
        }
        for (let i = 0; i < number; i++) {
            string += `<img src="./images/star_on.png" alt="star on" width="15px">\n`;
        }
        for (let i = 0; i < 5 - number; i++) {
            string += `<img src="./images/star_off.png" alt="star off" width="15px">\n`;
        }
        return string;
    }
    
    function displayQuotes() {
        displayLoader(true, ".section-quote .carousel-inner");
        $.ajax({
            type: "GET",
            url: "https://smileschool-api.hbtn.info/xml/quotes",
            dataType: "xml",
            success: function(xml) {
                $(xml).find("quote").each(function (index) {
                    const picUrl = $(this).find("pic_url").text();
                    const name = $(this).find("name").text(); 
                    const title = $(this).find("title").text();
                    const text = $(this).find("text").text();
                    addNewQuotes(picUrl, name, title, text, index);
                });
                displayLoader(false, ".section-quote .carousel-inner");
        }
    });
    }

    function displayVideos(carousel, url, selector) {
        displayLoader(true, carousel + " .carousel-inner");
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function(xml) {
                $(xml).find("video").each(function (index) {
                    const author = $(this).find("author").text();
                    const authorPicUrl = $(this).find("author_pic_url").text();
                    const thumbUrl = $(this).find("thumb_url").text();
                    const star = $(this).attr("star"); 
                    const title = $(this).find("title").text(); 
                    const subTitle = $(this).find("sub-title").text();
                    const duration = $(this).find("duration").text();
                    addNewCard(author, authorPicUrl, thumbUrl, star, title, subTitle, duration, index, selector);
                
                });
                while ($(carousel + ' .carousel-item').length < 5) {
                    $(xml).find("video").each(function (index) {
                        const author = $(this).find("author").text();
                        const authorPicUrl = $(this).find("author_pic_url").text();
                        const thumbUrl = $(this).find("thumb_url").text();
                        const star = $(this).attr("star"); 
                        const title = $(this).find("title").text(); 
                        const subTitle = $(this).find("sub-title").text();
                        const duration = $(this).find("duration").text();
                        addNewCard(author, authorPicUrl, thumbUrl, star, title, subTitle, duration, -1, selector);
                    });
                }
            displayLoader(false, carousel + " .carousel-inner");
        }
    });
    }

    function fillFilters() {
        $.ajax({
            type: "GET",
            url: "https://smileschool-api.hbtn.info/xml/courses",
            dataType: "xml",
            success: function(xml) {
                let search = $(".section-filters input").val();
                let topic = $("#topic button").attr("data-name");
                let sort = $("#sortBy button").attr("data-name");
                $(".section-filters input").val($(xml).find("q").text());
                $(xml).find("topics topic").each(function (index) {
                    const value = $(this).text();
                    if (index == 0) {
                        $("#topic button").text(formatValue(value));
                    }
                    $("#topic .dropdown-menu").append(`<a class="dropdown-item f-medium px-4 py-2" data-name="${value}" href="#">${formatValue(value)}</a>`);
                });
                $(".section-filters input").change(function () {
                    search = $(".section-filters input").val();
                    displayCourses(search, topic, sort);
                });
                $("#topic .dropdown-menu a").click(function () {
                    topic = $(this).attr("data-name");
                    $("#topic button").text($(this).text());
                    displayCourses(search, topic, sort);
                });
                $(xml).find("sorts sort").each(function (index) {
                    const value = $(this).text();
                    if (index == 0) {
                        $("#sortBy button").text(formatValue(value));
                    }
                    $("#sortBy .dropdown-menu").append(`<a class="dropdown-item f-medium px-4 py-2" data-name="${value}" href="#">${formatValue(value)}</a>`);
                });
                $("#sortBy .dropdown-menu a").click(function () {
                sort = $(this).attr("data-name");
                $("#sortBy button").text($(this).text());
                displayCourses(search, topic, sort);
            });
            }
        });
    }

    function formatValue(value) {
        const arr = value.split("_");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        const str = arr.join(" ");
        return str
    }

    function displayCourses(search = "", topic = "", sort = "") {
        displayLoader(true, ".section-result .section-inner");

        $("#matchingCourses").empty();
        let url = "https://smileschool-api.hbtn.info/xml/courses?";
        const params = {
            q: search,
            topic: topic,
            sort: sort,
        };
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function(xml) {
                $(xml).find("course").each(function (index) {
                    const author = $(this).find("author").text();
                    const authorPicUrl = $(this).find("author_pic_url").text();
                    const thumbUrl = $(this).find("thumb_url").text();
                    const star = $(this).attr("star"); 
                    const title = $(this).find("title").text(); 
                    const subTitle = $(this).find("sub-title").text();
                    const duration = $(this).find("duration").text();
                    addNewCourse(thumbUrl, title, subTitle, authorPicUrl, author, star, duration);
                
                });
                const numberCourse = $(xml).find("course").length;
                if (numberCourse > 1) {
                    $(".section-result p").text(numberCourse + " videos")
                } else {
                    $(".section-result p").text(numberCourse + " video")
                }
                displayLoader(false, ".section-result .section-inner");
        }
    });
    }

    function displayLoader(loader, tag) {
        if (loader === true) {
            $(tag).wrap("<div class=\"loader\"></div>");
        } else {
            $(tag).unwrap();
        }
        
    }

    function slideCarousel(e, selector) {
        /*
            CC 2.0 License Iatek LLC 2018 - Attribution required
        */
            const $e = $(e.relatedTarget);
            const idx = $e.index();
            const itemsPerSlide = 4;
            const totalItems = $(selector + ' .carousel-item').length;
            
            if (idx >= totalItems-(itemsPerSlide-1)) {
                const it = itemsPerSlide - (totalItems - idx);
                for (let i=0; i<it; i++) {
                    // append slides to end
                    if (e.direction=="left") {
                        $(selector + ' .carousel-item').eq(i).appendTo(selector + ' .carousel-inner');
                    }
                    else {
                        $(selector + ' .carousel-item').eq(0).appendTo(selector + ' .carousel-inner');
                    }
                }
            }
    }

    /*
    Carousel
    */
    $('#carouselVideos').on('slide.bs.carousel', function (e) {
        slideCarousel(e, "#carouselVideos");
    });

    $('#carouselLatestVideos').on('slide.bs.carousel', function (e) {
        slideCarousel(e, "#carouselLatestVideos");
    });

    const quotessection = document.getElementsByClassName("section-quote").length;
    if (quotessection > 0) {
        displayQuotes();
    }
    const carouselVideos = document.getElementById("carouselVideos");
    if (carouselVideos) {
        displayVideos("#carouselVideos", "https://smileschool-api.hbtn.info/xml/popular-tutorials", "#carouselVideos .carousel-inner");

    }
    const carouselLatestVideos = document.getElementById("carouselLatestVideos");
    if (carouselLatestVideos) {
        displayVideos("#carouselLatestVideos", "https://smileschool-api.hbtn.info/xml/latest-videos", "#carouselLatestVideos .carousel-inner");
  
    }
    const sectionresult = document.getElementsByClassName("section-result").length;
    if (sectionresult > 0) {
        fillFilters();
        displayCourses();
    }
});
