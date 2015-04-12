(function(global) {
    var AXES_2D = ["x", "y"];

    function intersectRayAABB(origin, vector, aabb) {
        // The last time the vector starts an intersection with the AABB on all
        // axes.
        var tnear = Number.NEGATIVE_INFINITY;

        // The first time the vector stops intersecting with the AANN on all
        // axes.
        var tfar = Number.POSITIVE_INFINITY;

        AXES_2D.forEach(function(axis) {
            // The coordinate of the origin on the axis.
            var p = origin[axis];

            // The magnitude of the vector on the axis.
            var w = vector[axis];

            // The minimum coordinate for the AABB on the axis.
            var aabbMin = aabb[axis] - (axis === "x" ? aabb.width : aabb.height) / 2;

            // The maximum coordinate for the ABB on the axis.
            var aabbMax = aabb[axis] + (axis === "x" ? aabb.width : aabb.height) / 2;

            if (w === 0) {
                // If the vector is not moving along this axis then we need
                // only to ensure that the origin is within the bounds of the
                // AABB. If this is not true then it is not possible for the
                // ray to collide with the AABB.
                if (p < aabbMin || aabbMax < p) {
                    return;
                }
            } else {
                // The time when the ray will intersect the minimum coordinate
                // of the AABB.
                var t1 = (aabbMin - p) / w;

                // The time when the ray will intersect the maximum coordinate
                // of the AABB.
                var t2 = (aabbMax - p) / w;

                // To simplify upcoming operations we want to ensure that t1
                // holds the time of the first intersection with the AABB and
                // t2 holds the time of the last intersection. If t1 is greater
                // than t2 then clearly we need to swap these times.
                if (t1 > t2) {
                    var tmp = t1;
                    t1 = t2;
                    t2 = tmp;
                }

                tnear = Math.max(tnear, t1);
                tfar = Math.min(tfar, t2);
            }
        });

        if (tnear <= tfar && 0 <= tnear) {
            return {
                t1: Math.round(tnear * 1000) / 1000,
                t2: Math.round(tfar * 1000) / 1000
            };
        }
    }

    global.CCD = {
        intersectRayAABB: intersectRayAABB
    };
})(this);
