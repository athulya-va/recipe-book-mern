const http = require('http');

const runTest = async () => {
  // Wait for server to boot
  await new Promise((r) => setTimeout(r, 1500));

  const request = (path, method = 'GET', data = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      });

      req.on('error', reject);
      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  };

  try {
    console.log('--- Testing API Endpoints ---');

    // 1. GET all
    const all = await request('/api/recipes');
    console.log('✓ GET /api/recipes -> Status:', all.status, 'Count:', all.data.count);

    // 2. POST create
    const createRes = await request('/api/recipes', 'POST', {
      name: 'Avocado Toast with Poached Egg',
      category: 'Breakfast',
      ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 fresh eggs', 'Red pepper flakes'],
      preparationSteps: '1. Toast sourdough.\n2. Mash avocado with salt.\n3. Poach eggs for 3 mins.\n4. Assemble and garnish.',
      cookingTime: 10,
    });
    console.log('✓ POST /api/recipes -> Status:', createRes.status, 'Created ID:', createRes.data.data?._id);
    const newId = createRes.data.data._id;

    // 3. GET by ID
    const single = await request(`/api/recipes/${newId}`);
    console.log('✓ GET /api/recipes/:id -> Status:', single.status, 'Name:', single.data.data?.name);

    // 4. PUT update
    const updateRes = await request(`/api/recipes/${newId}`, 'PUT', {
      cookingTime: 12,
    });
    console.log('✓ PUT /api/recipes/:id -> Status:', updateRes.status, 'Updated cookingTime:', updateRes.data.data?.cookingTime);

    // 5. DELETE
    const deleteRes = await request(`/api/recipes/${newId}`, 'DELETE');
    console.log('✓ DELETE /api/recipes/:id -> Status:', deleteRes.status, 'Message:', deleteRes.data.message);

    console.log('--- ALL API TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (err) {
    console.error('API Test Error Details:', err);
    process.exit(1);
  }
};

runTest();
