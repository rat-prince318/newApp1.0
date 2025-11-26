var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button, Box, Text, Select, VStack, Grid, GridItem, Alert, AlertIcon, AlertDescription, Input } from '@chakra-ui/react';
function DistributionGenerator(_a) {
    var onDataChange = _a.onDataChange;
    var _b = useState(''), sampleSize = _b[0], setSampleSize = _b[1];
    var _c = useState('normal'), selectedDistribution = _c[0], setSelectedDistribution = _c[1];
    var _d = useState({}), params = _d[0], setParams = _d[1];
    var _e = useState(''), errorMessage = _e[0], setErrorMessage = _e[1];
    // Define configurations for various distributions
    var distributionConfigs = {
        normal: {
            name: 'Normal Distribution',
            params: [
                { name: 'mean', label: 'Mean (μ)', min: -100, max: 100, step: 0.1, defaultValue: 0 },
                { name: 'std', label: 'Standard Deviation (σ)', min: -100, max: 100, step: 0.1, defaultValue: 0 },
            ],
            formula: 'f(x) = (1/(σ√(2π))) * e^(-(x-μ)²/(2σ²))',
        },
        uniform: {
            name: 'Uniform Distribution',
            params: [
                { name: 'a', label: 'Minimum Value (a)', min: -100, max: 100, step: 0.1, defaultValue: 0 },
                { name: 'b', label: 'Maximum Value (b)', min: -100, max: 100, step: 0.1, defaultValue: 1 },
            ],
            formula: 'f(x) = 1/(b-a) for a ≤ x ≤ b',
        },
        binomial: {
            name: 'Binomial Distribution',
            params: [
                { name: 'n', label: 'Number of Trials (n)', min: 1, max: 100, step: 1, defaultValue: 10 },
                { name: 'p', label: 'Success Probability (p)', min: 0.1, max: 0.9, step: 0.01, defaultValue: 0.5 },
            ],
            formula: 'P(k) = C(n,k) * p^k * (1-p)^(n-k)',
        },
        poisson: {
            name: 'Poisson Distribution',
            params: [
                { name: 'lambda', label: 'λ Parameter', min: 0.1, max: 20, step: 0.1, defaultValue: 5 },
            ],
            formula: 'P(k) = (e^(-λ) * λ^k) / k!',
        },
        exponential: {
            name: 'Exponential Distribution',
            params: [
                { name: 'lambda', label: 'λ Parameter', min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
            ],
            formula: 'f(x) = λ * e^(-λx) for x ≥ 0',
        },
        gamma: {
            name: 'Gamma Distribution',
            params: [
                { name: 'shape', label: 'Shape Parameter (k)', min: 0.1, max: 10, step: 0.1, defaultValue: 2 },
                { name: 'scale', label: 'Scale Parameter (θ)', min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
            ],
            formula: 'f(x) = (x^(k-1) * e^(-x/θ)) / (θ^k * Γ(k)) for x > 0',
        },
    };
    // Initialize parameters
    useEffect(function () {
        var config = distributionConfigs[selectedDistribution];
        var initialParams = {};
        config.params.forEach(function (param) {
            initialParams[param.name] = param.defaultValue;
        });
        setParams(initialParams);
    }, [selectedDistribution]);
    var handleParamChange = function (paramName, value) {
        setParams(function (prevParams) {
            var _a;
            return (__assign(__assign({}, prevParams), (_a = {}, _a[paramName] = value, _a)));
        });
    };
    var generateMockData = function () {
        var data = [];
        // Use default sample size if not specified or not a valid number
        var actualSampleSize = isNaN(Number(sampleSize)) || Number(sampleSize) <= 0 ? 1000 : Number(sampleSize);
        switch (selectedDistribution) {
            case 'normal':
                for (var i = 0; i < actualSampleSize; i++) {
                    var u1 = Math.random();
                    var u2 = Math.random();
                    var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                    data.push(params.mean + params.std * z);
                }
                break;
            case 'uniform':
                var a = params.a;
                var b = params.b;
                for (var i = 0; i < actualSampleSize; i++) {
                    data.push(a + Math.random() * (b - a));
                }
                break;
            case 'binomial':
                var n = params.n;
                var p = params.p;
                for (var i = 0; i < actualSampleSize; i++) {
                    var successes = 0;
                    for (var j = 0; j < n; j++) {
                        if (Math.random() < p) {
                            successes++;
                        }
                    }
                    data.push(successes);
                }
                break;
            case 'poisson':
                var lambda = params.lambda;
                for (var i = 0; i < actualSampleSize; i++) {
                    var k = 0;
                    var p_1 = 1;
                    var l = Math.exp(-lambda);
                    do {
                        k++;
                        p_1 *= Math.random();
                    } while (p_1 > l);
                    data.push(k - 1);
                }
                break;
            case 'exponential':
                var expLambda = params.lambda;
                for (var i = 0; i < actualSampleSize; i++) {
                    data.push(-Math.log(Math.random()) / expLambda);
                }
                break;
            case 'gamma':
                var shape = params.shape;
                var scale = params.scale;
                for (var i = 0; i < actualSampleSize; i++) {
                    // Generate gamma distribution random numbers using Marsaglia and Tsang's method
                    if (shape < 1) {
                        // Fix: Use acceptance-rejection method instead of recursive calls
                        var k = shape;
                        var c = (1 / k) - 1;
                        var x = void 0, u = void 0;
                        do {
                            x = Math.pow(Math.random(), 1 / k);
                            u = Math.random();
                        } while (u > Math.exp(-x + c * (x - 1)));
                        data.push(x * scale);
                    }
                    else {
                        var d = shape - 1 / 3;
                        var c = 1 / Math.sqrt(9 * d);
                        var x = void 0, v = void 0, u = void 0;
                        do {
                            do {
                                x = Math.random();
                                v = 1 + c * x;
                            } while (v <= 0);
                            v = Math.pow(v, 3);
                            u = Math.random();
                        } while (u >= 1 - 0.0331 * Math.pow(x, 4) && Math.log(u) >= 0.5 * Math.pow(x, 2) + d * (1 - v + Math.log(v)));
                        data.push(d * v * scale);
                    }
                }
                break;
            default:
                throw new Error('Unsupported distribution type');
        }
        return data;
    };
    var handleGenerate = function () {
        try {
            // Clear previous errors except for standard deviation negative error
            if (errorMessage !== 'Standard deviation cannot be negative') {
                setErrorMessage('');
            }
            // Validate parameters
            if (selectedDistribution === 'uniform' && params.a >= params.b) {
                throw new Error('Minimum value must be less than maximum value for uniform distribution');
            }
            // Validate standard deviation before generating
            if (selectedDistribution === 'normal' && params.std !== undefined && params.std <= 0) {
                throw new Error('Standard deviation must be positive for normal distribution');
            }
            // Use setTimeout to simulate asynchronous operation without async/await
            setTimeout(function () {
                try {
                    var data = generateMockData();
                    var config = distributionConfigs[selectedDistribution];
                    onDataChange(data, {
                        type: selectedDistribution,
                        name: config.name,
                        formula: config.formula,
                        parameters: __assign({}, params),
                    });
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Error generating data');
                }
            }, 300);
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error generating data');
        }
    };
    var currentConfig = distributionConfigs[selectedDistribution];
    return (_jsx(Box, { p: 4, children: _jsxs(Grid, { templateColumns: "1fr 1fr", gap: 6, children: [_jsx(GridItem, { children: _jsxs(VStack, { align: "stretch", spacing: 4, children: [_jsxs(Box, { children: [_jsx(Text, { mb: 2, fontWeight: "bold", children: "Select Distribution Type" }), _jsx(Select, { value: selectedDistribution, onChange: function (e) { return setSelectedDistribution(e.target.value); }, children: Object.entries(distributionConfigs).map(function (_a) {
                                            var key = _a[0], config = _a[1];
                                            return (_jsx("option", { value: key, children: config.name }, key));
                                        }) })] }), _jsxs(Box, { children: [_jsx(Text, { mb: 2, fontWeight: "bold", children: "Sample Size" }), _jsx(Input, { type: "text", placeholder: "Enter sample size", value: sampleSize, onChange: function (e) {
                                                setSampleSize(e.target.value);
                                            } })] }), currentConfig.params.map(function (param) { return (_jsxs(Box, { children: [_jsx(Text, { mb: 2, fontWeight: "bold", children: param.label }), _jsx(Input, { type: "text", placeholder: "Enter " + param.name, value: params[param.name] || '', onChange: function (e) {
                                            var value = e.target.value;
                                            // Allow empty or numeric values
                                            if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                                                // Handle standard deviation separately for negative value error
                                                if (param.name === 'std') {
                                                    if (value === '') {
                                                        handleParamChange(param.name, undefined);
                                                        setErrorMessage('');
                                                    } else {
                                                        var numValue = parseFloat(value);
                                                        if (numValue < 0) {
                                                            // Set error message for negative standard deviation
                                                            setErrorMessage('Standard deviation cannot be negative');
                                                            // Still update the value so user can see it, but mark as invalid
                                                            handleParamChange(param.name, numValue);
                                                        } else {
                                                            setErrorMessage('');
                                                            handleParamChange(param.name, numValue);
                                                        }
                                                    }
                                                }
                                                // For other parameters that must be positive
                                                else if (value !== '' && (param.name === 'p' || param.name === 'lambda' || param.name === 'shape' || param.name === 'scale')) {
                                                    var numValue = parseFloat(value);
                                                    if (numValue > 0) {
                                                        handleParamChange(param.name, numValue);
                                                    }
                                                    // Ignore non-positive values but allow empty input
                                                }
                                                // For other parameters including mean
                                                else {
                                                    handleParamChange(param.name, value === '' ? param.defaultValue : parseFloat(value));
                                                }
                                            }
                                        } })] }, param.name)); }), _jsx(Button, { onClick: handleGenerate, colorScheme: "blue", variant: "solid", size: "lg", children: "Generate Data" }), errorMessage && (_jsxs(Alert, { status: "error", children: [_jsx(AlertIcon, {}), _jsx(AlertDescription, { children: errorMessage })] }))] }) }), _jsx(GridItem, { children: _jsxs(Box, { p: 4, bg: "gray.50", borderRadius: "md", height: "100%", children: [_jsx(Text, { fontWeight: "bold", fontSize: "lg", mb: 2, children: currentConfig.name }), currentConfig.formula && (_jsx(Box, { mb: 4, p: 2, bg: "white", borderRadius: "md", children: _jsx(Text, { fontFamily: "monospace", fontSize: "sm", children: currentConfig.formula }) })), _jsx(Text, { fontWeight: "bold", mb: 2, children: "Parameter Description:" }), currentConfig.params.map(function (param) { return (_jsxs(Text, { fontSize: "sm", mb: 1, children: [_jsxs("strong", { children: [param.label, ":"] }), " ", param.name === 'mean' ? 'Central location of the distribution' :
                                        param.name === 'std' ? 'Degree of dispersion of the distribution' :
                                            param.name === 'a' ? 'Minimum value of the interval' :
                                                param.name === 'b' ? 'Maximum value of the interval' :
                                                    param.name === 'n' ? 'Number of independent trials' :
                                                        param.name === 'p' ? 'Probability of success in each trial' :
                                                            param.name === 'lambda' ? 'Average number of events per unit time' :
                                                                param.name === 'shape' ? 'Shape parameter that affects the distribution shape' :
                                                                    param.name === 'scale' ? 'Scale parameter that affects the distribution range' : ''] }, param.name)); }), _jsxs(Box, { mt: 6, children: [_jsx(Text, { fontWeight: "bold", mb: 2, children: "Instructions:" }), _jsxs("ul", { style: { listStyleType: 'disc', paddingLeft: '20px' }, children: [_jsx("li", { style: { fontSize: 'sm', marginBottom: '4px' }, children: "Select distribution type" }), _jsx("li", { style: { fontSize: 'sm', marginBottom: '4px' }, children: "Adjust sample size" }), _jsx("li", { style: { fontSize: 'sm', marginBottom: '4px' }, children: "Set distribution parameters" }), _jsx("li", { style: { fontSize: 'sm', marginBottom: '4px' }, children: "Click the \"Generate Data\" button" })] })] })] }) })] }) }));
}
export default DistributionGenerator;
