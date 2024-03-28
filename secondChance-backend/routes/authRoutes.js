router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();

          
        // Task 2: Access MongoDB `users` collection
        const usersCollection = db.collection('users');
        
        // Task 3: Check if user credentials already exists in the database and throw an error if they do
        const { email, password } = req.body;
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Task 4: Create a hash to encrypt the password so that it is not readable in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Task 5: Insert the user into the database
        const newUser = { email, password: hashedPassword };
        await usersCollection.insertOne(newUser);
        
        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        
        // Task 7: Log the successful registration using the logger
        logger.info(`User registered successfully: ${email}`);
        
        // Task 8: Return the user email and the token as a JSON
        res.json({ email, token });
        
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});
       
