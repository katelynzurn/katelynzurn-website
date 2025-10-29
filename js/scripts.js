// scripts.js for katelynzurn.com

$(function () {

    // =========================================================================
    // 01. Load Navigation & Footer
    // =========================================================================
    fetch('/nav.html')
        .then(response => response.text())
        .then(data => {
            $('#sidebar-content').html(data);

            // ========= Sidebar Toggle for Mobile =========
            $('#sidebar-toggle').click(function () {
                $('#sidebar-content').toggleClass('active');
                $('#sidebar').slideToggle(200);
                if ($(window).width() < 992) {
                    $('html, body').animate({ scrollTop: 0 }, 800);

                }
            });

            // ========= Submenu Toggle =========
            $('.nav-parent').click(function (e) {
                var href = $(this).attr('href');

                if (!href || href === '#' || href === window.location.pathname.split('/').pop()) {
                    e.preventDefault();

                    var $subnav = $(this).next('.subnav');

                    // Close other submenus
                    $('.subnav').not($subnav).slideUp(200);
                    $('.nav-parent').not(this).removeClass('active');

                    // Toggle current submenu
                    $subnav.slideToggle(200);
                    $(this).toggleClass('active');
                }
            });

            // ========= Default Submenu Expanded =========
            var pathname = window.location.pathname.split('/').pop();

            if (pathname === '' || pathname === 'index.html') {
                var $homeParent = $('.nav-parent').first();
                $homeParent.addClass('active');
                $homeParent.next('.subnav').show();
            }

            if (pathname === 'projects.html') {
                var $projectsParent = $('.nav-parent').filter(function () {
                    return $(this).attr('href').includes('projects.html');
                });
                $projectsParent.addClass('active');
                $projectsParent.next('.subnav').show();
            }

            // ========= Highlight Active Link Based on Scroll =========
            function setActiveLink() {
                var scrollPos = $(document).scrollTop();

                $('nav a').each(function () {
                    var currLink = $(this);
                    var href = currLink.attr("href");

                    if (href && href.startsWith("#")) {
                        var refElement = $(href);
                        if (refElement.length) {
                            if (
                                refElement.position().top <= scrollPos + 50 &&
                                refElement.position().top + refElement.height() > scrollPos + 50
                            ) {
                                $('nav a').removeClass("active");
                                $('nav .nav-parent').removeClass("active");

                                currLink.addClass("active");

                                var $subnav = currLink.closest('.subnav');
                                if ($subnav.length) {
                                    $subnav.slideDown(0);
                                    $subnav.prev('.nav-parent').addClass('active');
                                }
                            }
                        }
                    }
                });
            }

            // Run on page load
            setActiveLink();

            // Update on scroll
            $(window).scroll(setActiveLink);

        })
        .catch(err => console.error('Failed to load nav:', err));

      // Load Footer
      fetch('/footer.html')
        .then(response => response.text())
        .then(data => {
            $('body').append(data);
        })
        .catch(err => console.error('Failed to load footer:', err));


    // =========================================================================
    // 02. Smooth Scroll for Anchor Links
    // =========================================================================
    $('body').on('click', 'a[href*="#"]:not([href="#"])', function () {
        if (
            location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
            location.hostname === this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate(
                    { scrollTop: target.offset().top - 20 }, // adjust for fixed nav
                    600,
                    'swing'
                );
                return false;
            }
        }
    });

    // =========================================================================
    // 03. Interactive Tech Stack Hover Info
    // =========================================================================
    $('.tech-stack').each(function() {
        const $stack = $(this);
        const $info = $stack.next('.tech-info-text');

        $stack.find('.tech-icon').hover(
            function() {
                $info.text($(this).data('info'));
            },
            function() {
                $info.text('');
            }
        );
    });

    // =========================================================================
    // 04. GitHub Repo Stats
    // =========================================================================
    const githubStats = document.getElementById("github-stats");

    if (githubStats) {
        fetch("https://api.github.com/repos/katelynzurn/katelynzurn-website")
            .then(response => response.json())
            .then(data => {
                if (data.message === "Not Found") {
                    githubStats.innerHTML = "<span>Repo not found or private.</span>";
                    return;
                }

                const stars = data.stargazers_count ?? 0;
                const forks = data.forks_count ?? 0;
                const updated = new Date(data.updated_at).toLocaleDateString();

                githubStats.innerHTML = `
                    <div class="github-data">
                        <p>
                            <i class="fa-solid fa-star"></i> <strong>${stars}</strong> Stars &nbsp; | &nbsp;
                            <i class="fa-solid fa-code-branch"></i> <strong>${forks}</strong> Forks &nbsp; | &nbsp;
                            <i class="fa-regular fa-clock"></i> Updated <strong>${updated}</strong>
                        </p>
                    </div>
                `;
                githubStats.classList.add("loaded");
            })
            .catch(error => {
                githubStats.innerHTML = "<span>Unable to load GitHub data right now.</span>";
                console.error("GitHub API Error:", error);
            });
    }

});
