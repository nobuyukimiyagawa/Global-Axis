document.addEventListener('DOMContentLoaded', () => {
    // Check if hero animation container exists
    const heroAnim = document.getElementById('hero-anim');
    if (!heroAnim) return;

    // Elements
    const sprout = document.getElementById('ha-sprout');
    const rainGroup = document.getElementById('ha-rain-group');
    const drops = document.querySelectorAll('.rain-drop');
    const sun = document.getElementById('ha-sun');
    const sunRays = document.querySelector('.sun-rays');
    const treeGroup = document.getElementById('ha-tree-group');
    const apples = document.querySelectorAll('.apple');

    // Initial States
    gsap.set(sprout, { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 });
    gsap.set(rainGroup, { opacity: 0 });
    gsap.set(sun, { scale: 0, opacity: 0 });
    gsap.set(treeGroup, { scale: 0, transformOrigin: 'center bottom', opacity: 0 });
    gsap.set(apples, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    // Initialize arm rotation (since SVG is straight, set rest angle)
    gsap.set('#farmer-arm-l', { rotation: 15 });

    // Timeline
    // Timeline - Set repeat to 0 to allow the final state (Harvest) to loop indefinitely without resetting the scene
    const tl = gsap.timeline({ repeat: 0 });

    // 1. Sprout Appears
    tl.to(sprout, { duration: 1.5, scaleY: 1, ease: 'back.out(1.7)' })

        // 2. Rain Falls (Blue)
        .to(rainGroup, { duration: 0.5, opacity: 1 }, "-=0.5")
        .fromTo(drops,
            { y: -50, opacity: 0 },
            { y: 300, opacity: 1, duration: 1, stagger: 0.2, ease: 'power1.in', repeat: 2 }, "<" // Increased y to reach sprout
        )
        .to(rainGroup, { duration: 0.5, opacity: 0 }) // Rain stops

        // 3. Sun Rises (Red)
        .to(sun, { duration: 1.5, scale: 1, opacity: 1, ease: 'elastic.out(1, 0.5)' }, "sunRise")
        .to(sun, { rotation: 360, duration: 10, repeat: -1, ease: 'linear' }, "<") // Rotate entire sun group
        // Add Pulse to the Sun Core (circle.sun-core)
        .to(sun.querySelector('.sun-core'), {
            scale: 1.1,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'center center' // Ensure origin for pulse
        }, "<")

        // 4. Tree Grows (Green) - Sprout morphs/hides, Tree appears
        // Schedule relative to sunRise because previous tweens are infinite
        .to(sprout, { duration: 0.5, scaleY: 0, opacity: 0 }, "sunRise+=2.0")
        .to(treeGroup, { duration: 1.5, scale: 1, opacity: 1, ease: 'back.out(1.2)' }, "<+0.3")

        // 5. Apples Appear (Red) - Ensure opacity bumps to 1
        .to(apples.length ? apples : '#ha-apples', { duration: 0.8, scale: 1, opacity: 1, stagger: 0.1, ease: 'elastic.out(1, 0.3)' }, "-=0.5")

        // 6. Orchard Appears (Background Trees)
        .to('#ha-orchard', { duration: 1, opacity: 1, scale: 1, ease: 'power2.out' }, "+=0.2")

        // 7. Farmer Enters (Fade in at position)
        .fromTo('#ha-farmer',
            { x: 75, opacity: 0 },
            { x: 75, opacity: 1, duration: 1, ease: 'power2.out' }, "+=0.2"
        );

    // Independent Harvest & Transport Sequence
    gsap.delayedCall(8, () => {
        const sequenceTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        const arm = '#farmer-arm-l';
        const body = '#farmer-body-group';
        const basket = '#ha-basket';
        const truck = '#ha-truck';

        // Ensure Basket is visible
        gsap.set(basket, { opacity: 1 });

        // Phase 1: Harvest 3 Apples
        // We will animate the actual apples from the tree to the basket
        const appleNodes = gsap.utils.toArray(apples); // Array of apple elements
        // Pick top 3 for animation, leave others
        const targets = appleNodes.slice(0, 3);

        targets.forEach((apple, i) => {
            // Move arm to apple
            sequenceTl.to(arm, { rotation: 130, duration: 0.5, ease: 'power2.out' });

            // "Pick" - Parent change simulation or just move apple
            sequenceTl.to(apple, {
                x: 340 - (parseFloat(apple.getAttribute('cx') || 0)) + (Math.random() * 20 - 10), // Target basket X (approx)
                y: 0 - (parseFloat(apple.getAttribute('cy') || 0)) - 30 + (Math.random() * 10),   // Target basket Y (approx)
                duration: 0.5,
                ease: 'power1.in'
            }, "<0.1"); // Start moving shortly after arm reaches

            // Return arm
            sequenceTl.to(arm, { rotation: 15, duration: 0.4, ease: 'power2.in' });
        });

        // Phase 2: Truck Arrives
        sequenceTl.to(truck, {
            x: 280, // Position near farmer/basket
            opacity: 1,
            duration: 2,
            ease: 'power2.out'
        }, "+=0.5");

        // Phase 3: Loading (Basket moves to Truck)
        sequenceTl.to(basket, {
            x: 280 - 20, // Move to truck bed position
            y: -25,      // Up onto bed
            duration: 1,
            ease: 'power2.inOut'
        });

        // Phase 4: Departure
        sequenceTl.to([truck, basket], {
            x: -600, // Drive off screen left
            duration: 2.5,
            ease: 'power2.in',
            delay: 0.5
        });

        // Reset Scene for Loop (Optional, or just one-off)
        // To loop, we need to reset apples, basket, truck
        sequenceTl.add(() => {
            // Reset apples to tree
            gsap.set(targets, { x: 0, y: 0, opacity: 0 });
            gsap.to(targets, { opacity: 1, duration: 1 }); // Grow back

            // Reset Basket
            gsap.set(basket, { x: 0, y: 0, opacity: 1 }); // Reset to original pos (but relative to group??)
            // Wait, basket is in group transform(340, 0). 
            // The tween animated x relative to starting or absolute?
            // GSAP default is relative to current if just x, but here likely absolute from start if not relative syntax.
            // Actually, best to set clear props or restart.

            // To make it loop cleanly:
            gsap.set(basket, { clearProps: "all" });
            gsap.set(basket, { opacity: 1 }); // Ensure visible

            gsap.set(truck, { x: 450, opacity: 0 }); // Reset truck
        }, "+=1");
    });

});
