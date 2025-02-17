function sparse_driver() {

    // check file validity first
    if(!checkValidFile()) {return;}
    // check sparse data proportion is valid
    if(!sparse_prop_check()) {return;}


    // $("#surfacePlot").html('');
    document.getElementById('surfacePlot').innerHTML = '';
    add_spinner();

    // call sparse data function
    sparse_data();
}


function sparse_prop_check() {
    var val = $("#sparseProp").val();
    if(val > 1 || val < 0.00001) {
        alert("Please enter valid proportion");
        $("#sparseProp").val(0.1);
        return false;
    }
    else {
        return true;
    }
}

function generate_pairs() {
    let pairs = [];
    var cellCount = Math.floor((rows*cols)*($("#sparseProp").val()));

    while(pairs.length < cellCount) {
        let r = Math.floor(Math.random() * (rows-2)) + 1;
        let c = Math.floor(Math.random() * (cols-2)) + 1;
        let pair = [r, c];

        let isUnique = !pairs.some(existing => existing[0] == r && existing[1] == c);
        if (isUnique) {
            pairs.push(pair);
        }
    }

    return pairs;
}

function sparse_data() {

    // copy over input arrays
    OGsparse = OGmatrix.map(sub => sub.slice());
    sparse = matrix.map(sub => sub.slice());

    // var mean = (parseFloat(OGmax) + parseFloat(OGmin)) / 2.0;

    let pairs = generate_pairs();
    var count = 0;
    var r, c;

    while(count < pairs.length) {
        r = pairs[count][0];
        c = pairs[count][1];
        sparse[r][c] = -9999;
        OGsparse[r][c] = -9999;
        count++;
    }

    plot_surface(sparse);
}
